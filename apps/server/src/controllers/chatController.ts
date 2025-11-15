import { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import { Message } from "@lafineequipe/types";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { getPool } from "@lafineequipe/db";
import { retryWithBackoff, RetryPresets } from "../utils/retryUtils";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const SYSTEM_PROMPT =
  "Tu es Lézard GPT, un assistant IA pour l'association 'La Fine Equipe'. Fais quelques blagues en rapport avec les lézards quand c'est approprié, mais sois toujours factuel.";

const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004",
  apiKey: GEMINI_API_KEY,
});

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

    const lastUserMessageContent = lastUserMessage.content;
    const historyForCondensation = [
      { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
      ...messages.slice(0, -1).map((msg: Message) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      })),
    ];

    let condensedQuestion = lastUserMessageContent;

    try {
      const condensationPrompt = `
        Étant donné l'historique de chat suivant et la dernière question de l'utilisateur, 
        reformule la dernière question pour qu'elle soit une question autonome et complète.
        
        Historique:
        ${historyForCondensation
          .slice(1)
          .map((msg) => `${msg.role}: ${msg.parts[0].text}`)
          .join("\n")}
        
        Dernière question: ${lastUserMessageContent}
        
        Question autonome:
      `;

      const condensationResult = await retryWithBackoff(
        () =>
          ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: [{ role: "user", parts: [{ text: condensationPrompt }] }],
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
        condensedQuestion = condensationResult.text.trim();
        console.log("Condensed Question:", condensedQuestion);
      }
    } catch (error) {
      console.error("Error condensing question:", error);
    }

    let relevantDocs;
    try {
      const store = await getVectorStore();
      relevantDocs = await retryWithBackoff(
        () => store.similaritySearch(condensedQuestion, 4),
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
      res.write(
        `${JSON.stringify({
          error: errorMessage,
          done: true,
        })}\n\n`
      );
      res.end();
      return;
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
      Tu es Lézard GPT. Réponds à ma question de manière précise mais concise en te basant sur le contexte ci-dessous.
      - Tu dois utiliser **en priorité** les informations du contexte pour répondre.
      - Si la question ne concerne pas directement 'La Fine Equipe', réponds sans inventer d'informations.
      - Si la question concerne directement 'La Fine Equipe' et que la réponse n'est pas dans le contexte, dis-le gentiment (ex: "Je n'ai pas cette information, désolé !").
      - Ma question est (potentiellement reformulée) : "${condensedQuestion}"
      - Pour information nous sommes le : ${new Date().toLocaleDateString(
        "fr-FR",
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      )}.
      - Ne parle **jamais** du 'contexte' ni du texte dans ta réponse. Si tu avais **besoin** du contexte pour formuler ta réponse, et qu'il ne t'a rien donné, dis simplement que tu n'as pas cette information. 
      - Garde ta personnalité de lézard, mais la précision est prioritaire.
      
      **Contexte fourni:**
      """
      ${context}
      """
      
      **Ma question originale était:** "${lastUserMessageContent}"
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
            console.log("Switching to lighter model due to repeated failures.");
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
          res.write(`${JSON.stringify({ chunk: chunk.text })}\n\n`);
        }
      }

      res.write(`${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      console.error("Error during content generation:", error);
      res.write(
        `${JSON.stringify({
          error: "Failed to generate response",
          done: true,
        })}\n\n`
      );
      res.end();
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
