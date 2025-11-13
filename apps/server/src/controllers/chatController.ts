import { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import { Message } from "@lafineequipe/types";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { getPool } from "@lafineequipe/db";

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
        role: msg.sender === "user" ? "user" : "model",
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
          .map(
            (msg) =>
              `${msg.role === "user" ? "User" : "Model"}: ${msg.parts[0].text}`
          )
          .join("\n")}
        
        Dernière question: ${lastUserMessageContent}
        
        Question autonome:
      `;

      const condensationResult = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: condensationPrompt }] }],
      });

      if (condensationResult.text) {
        condensedQuestion = condensationResult.text.trim();
      }
    } catch (error) {
      console.error("Error condensing question:", error);
      condensedQuestion = lastUserMessageContent;
    }

    let relevantDocs;
    try {
      const store = await getVectorStore();
      relevantDocs = await store.similaritySearch(condensedQuestion, 4);
    } catch (error) {
      console.error("Error during vector search:", error);
      res.write(
        `${JSON.stringify({
          error: "Failed to retrieve relevant documents",
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
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
    ];

    const finalRagPrompt = `
      Tu es Lézard GPT. Réponds à ma question en te basant sur le contexte ci-dessous.
      - Tu dois utiliser **uniquement** les informations du contexte pour répondre.
      - Si la réponse n'est pas dans le contexte, dis-le gentiment (ex: "Je ne trouve pas cette info dans mes documents, désolé !").
      - Ma question est (potentiellement reformulée) : "${condensedQuestion}"
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

    try {
      const response = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: finalConversationHistory,
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
        `${JSON.stringify({ error: "Failed to generate response" })}\n\n`
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
      res.write(
        `${JSON.stringify({ error: "An unexpected error occurred" })}\n\n`
      );
      res.end();
    }
  }
};
