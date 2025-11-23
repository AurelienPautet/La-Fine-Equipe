import { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import { Message } from "@lafineequipe/types";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { getPool } from "@lafineequipe/db";
import { retryWithBackoff, RetryPresets } from "../utils/retryUtils";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { getEmbeddings } from "../services/embeddingsService";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const responseSchema = z.object({
  question: z.string(),
  needsContext: z.boolean(),
  answer: z.string().optional(),
});

const SYSTEM_PROMPT =
  "Tu es Lézard GPT, un assistant IA pour l'association 'La Fine Equipe'. Fais quelques blagues en rapport avec les lézards quand c'est approprié, mais sois toujours factuel.";

const pool = getPool();

export const vectorStoreConfig = {
  pool,
  tableName: '"LaFineEquipe-document_chunks"',
  vectorColumnName: "embedding",
  contentColumnName: "text",
  metadataColumnName: "metadata",
  dimensions: 768,
};

let vectorStore: PGVectorStore;

async function getVectorStore() {
  if (!vectorStore) {
    try {
      console.log("Initializing Vector Store...");
      const embeddings = getEmbeddings();
      vectorStore = await PGVectorStore.initialize(
        embeddings,
        vectorStoreConfig
      );
      console.log("Vector Store initialized.");
    } catch (error) {
      console.error("Failed to initialize Vector Store:", error);
      throw new Error("Vector Store initialization failed");
    }
  }
  return vectorStore;
}

export const postChat = async (req: Request, res: Response) => {
  try {
    const { messages } = req.body as { messages: Message[] };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res
        .status(400)
        .json({ error: "Messages array is required and cannot be empty" });
    }

    const lastUserMessage = messages[messages.length - 1];
    if (
      !lastUserMessage ||
      !lastUserMessage.content ||
      typeof lastUserMessage.content !== "string"
    ) {
      return res
        .status(400)
        .json({ error: "Last message must have valid content" });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();
    const writeChunk = (data: Record<string, unknown>) => {
      res.write(`${JSON.stringify(data)}\n\n`);
    };

    const lastUserMessageContent = lastUserMessage.content;
    const historyForCondensation = [
      { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
      ...messages.slice(0, -1).map((msg: Message) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      })),
    ];

    let condensedQuestion = lastUserMessageContent;
    let needsContext = true;

    try {
      const condensationPrompt = `
        Given the following chat history and ESPECIALLY the last user question, 
        rephrase the last question to make it a standalone and complete question. It must be faithful to the original meaning.
        Do not rephrase if the question is a simple thank you or greeting.

        Consider ambiguous or vague questions as if they directly concern 'La Fine Equipe'.
        Ex: "Quelle est sa mission ?" => "Quelle est la mission de La Fine Equipe ?"
        Ex: "Qui est Esteban ?" => "Qui est Esteban dans le contexte de La Fine Equipe ?"

        History:
        ${historyForCondensation
          .slice(1)
          .map((msg) => `${msg.role}: ${msg.parts[0].text}`)
          .join("\n")}
        
        Last question: ${lastUserMessageContent}

        **IMPORTANT - Determining if context is needed (needsContext):**
        - Set needsContext = true if the question asks about:
          * Specific information about 'La Fine Equipe' (events, members, projects, history, mission, activities, etc.)
          * Specific people in the context of La Fine Equipe (who is X, what does Y do, etc.)
          * Any factual details that would require accessing the knowledge base
        
        - Set needsContext = false ONLY if the question is:
          * A simple greeting, thank you, or farewell
          * A general question that doesn't require specific knowledge about La Fine Equipe (e.g., "What time is it?", "How are you?")
          * A question you can answer with general knowledge WITHOUT any specific information about La Fine Equipe
        
        **CRITICAL RULE:** When in doubt, ALWAYS set needsContext = true. It's better to retrieve context unnecessarily than to answer without proper information.

        If needsContext = false, you MUST provide a complete answer IN FRENCH in the 'answer' field.
        If needsContext = true, leave the 'answer' field empty (it will be handled by the RAG system).

        For information, today's date is: ${new Date().toLocaleDateString(
          "fr-FR",
          {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        )}.
        
        Response schema:
        {
        question: "the rephrased question here (in French)",
        needsContext: true/false
        answer: "the answer here IN FRENCH (only if needsContext = false)"
        }
      `;

      const condensationResult = await retryWithBackoff(
        () =>
          ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: [{ role: "user", parts: [{ text: condensationPrompt }] }],
            config: {
              responseMimeType: "application/json",
              responseJsonSchema: zodToJsonSchema(responseSchema),
            },
          }),
        {
          ...RetryPresets.apiCall,
          onRetry: (attempt, error) => {
            console.warn(
              `Retry attempt ${attempt} for question condensation:`,
              error.message
            );
          },
        }
      );

      if (condensationResult.text) {
        const condensationResultParsed = responseSchema.parse(
          JSON.parse(condensationResult.text)
        );
        condensedQuestion = condensationResultParsed.question.trim();
        needsContext = condensationResultParsed.needsContext;
        console.log("Condensed Question:", condensedQuestion);
        writeChunk({
          chunk: "** Question reformulée: **\n" + condensedQuestion + "\n",
          type: "reasoningContent",
        });
        writeChunk({
          chunk: "** Besoin de contexte: **\n" + needsContext + "\n",
          type: "reasoningContent",
        });
        console.log("res", condensationResultParsed);
        if (!needsContext) {
          if (
            condensationResultParsed.answer &&
            condensationResultParsed.answer !== ""
          ) {
            console.log("Answered without context.");
            writeChunk({
              chunk: condensationResultParsed.answer,
              type: "content",
            });
          } else {
            console.log(
              "No context needed but no answer provided, using fallback."
            );
            writeChunk({
              chunk:
                "Je n'ai pas bien compris votre question. Pouvez-vous la reformuler ?",
              type: "content",
            });
          }
          writeChunk({ done: true });
          res.end();
          return;
        }
      }
    } catch (error) {
      console.error("Error condensing question:", error);
    }

    let relevantDocs = [];
    if (needsContext) {
      try {
        const store = await getVectorStore();
        relevantDocs = await retryWithBackoff(
          () =>
            store.maxMarginalRelevanceSearch(condensedQuestion, {
              k: 15,
              fetchK: 30,
              lambda: 0.7,
            }),
          {
            ...RetryPresets.vectorStore,
            onRetry: (attempt, error) => {
              console.warn(
                `Retry attempt ${attempt} for vector store search:`,
                error.message
              );
            },
          }
        );
      } catch (error) {
        console.error("Error during vector search:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to retrieve relevant documents";
        writeChunk({
          error: errorMessage,
          done: true,
        });
        res.end();
        return;
      }

      writeChunk({
        chunk:
          "** Nombre de documents analysés: **\n" + relevantDocs.length + "\n",
        type: "reasoningContent",
      });

      for (const [index, doc] of relevantDocs.entries()) {
        const metadata = doc.metadata as {
          sourceId?: number;
          sourceType?: string;
          loc?: { lines?: { from?: number; to?: number } };
        };
        const sourceType = metadata?.sourceType || "inconnu";
        const lineInfo = metadata?.loc?.lines
          ? `lignes ${metadata.loc.lines.from}-${metadata.loc.lines.to}`
          : "";

        writeChunk({
          chunk: `- Doc ${index + 1} - ${sourceType} (ID: ${
            metadata?.sourceId
          }) ${lineInfo}\n`,
          type: "reasoningContent",
        });
      }

      const context = relevantDocs
        .map((doc) => doc.pageContent)
        .join("\n\n---\n\n");

      const finalConversationHistory = [
        { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
        ...messages.slice(0, -1).map((msg: Message) => ({
          role: msg.role,
          parts: [{ text: msg.content }],
        })),
      ];

      const finalRagPrompt = `
      You are Lézard GPT. Answer my question precisely but concisely based on the context below. YOU MUST ANSWER IN FRENCH.
      - You must use **priority** information from the context to answer.
      - If the question doesn't directly concern 'La Fine Equipe', answer without making up information.
      - If the question directly concerns 'La Fine Equipe' and the answer is not in the context, say so kindly (e.g., "Je n'ai pas cette information, désolé !").
      - My question is (potentially rephrased): "${condensedQuestion}"
      - For information, today's date is: ${new Date().toLocaleDateString(
        "fr-FR",
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      )}.
      - **Never** talk about the 'context' or the text in your answer. If you **needed** the context to formulate your answer and it didn't provide anything, simply say you don't have this information. 
      - Keep your lizard personality, but precision is the priority. Make jokes ONLY if relevant.
      
      **Provided context:**
      """
      ${context}
      """
      
      **My original question was:** "${lastUserMessageContent}"
      
      REMEMBER: YOUR ENTIRE RESPONSE MUST BE IN FRENCH.
    `;

      finalConversationHistory.push({
        role: "user",
        parts: [{ text: finalRagPrompt }],
      });

      let model = "gemini-2.5-flash";

      try {
        const generateContent = () =>
          ai.models.generateContentStream({
            model: model,
            contents: finalConversationHistory,
          });

        const response = await retryWithBackoff(generateContent, {
          ...RetryPresets.apiCall,
          onRetry: (attempt, error) => {
            console.warn(
              `Retry attempt ${attempt} for content generation:`,
              error.message
            );
            if (attempt > 4) {
              console.log(
                "Switching to lighter model due to repeated failures."
              );
              model = "gemini-2.5-flash-lite";
            } else if (
              error.message.includes("You exceeded your current quota")
            ) {
              console.log(
                "Quota exceeded for model",
                model,
                "- switching to a lighter model."
              );
              model = "gemini-2.5-flash-lite";
            }
          },
        });

        for await (const chunk of response) {
          if (chunk.text) {
            writeChunk({ chunk: chunk.text, type: "content" });
          }
        }

        writeChunk({ done: true });
        res.end();
      } catch (error) {
        console.error("Error during content generation:", error);
        writeChunk({
          error: "Failed to generate response",
          done: true,
        });
        res.end();
      }
    }
  } catch (error) {
    console.error("Error processing chat message:", error);

    if (!res.headersSent) {
      const errorMessage =
        error instanceof Error ? error.message : "Internal server error";
      res.status(500).json({ error: errorMessage });
    } else {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      res.write(`${JSON.stringify({ error: errorMessage, done: true })}\n\n`);
      res.end();
    }
  }
};
