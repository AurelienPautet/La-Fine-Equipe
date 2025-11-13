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
    console.log("Initializing Vector Store...");
    vectorStore = await PGVectorStore.initialize(embeddings, vectorStoreConfig);
    console.log("Vector Store initialized.");
  }
  return vectorStore;
}

export const postChat = async (req: Request, res: Response) => {
  try {
    const { messages } = req.body as { messages: Message[] };

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    const lastUserMessage = messages[messages.length - 1].content;
    const historyForCondensation = [
      { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
      ...messages.slice(0, -1).map((msg: Message) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
    ];

    let condensedQuestion = lastUserMessage;
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
        
        Dernière question: ${lastUserMessage}
        
        Question autonome:
      `;

    const condensationResult = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: condensationPrompt }] }],
    });
    condensedQuestion = condensationResult.text?.trim();

    const store = await getVectorStore();
    const relevantDocs = await store.similaritySearch(condensedQuestion, 4);
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
      
      **Ma question originale était:** "${lastUserMessage}"
    `;

    finalConversationHistory.push({
      role: "user",
      parts: [{ text: finalRagPrompt }],
    });

    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: finalConversationHistory,
    });

    for await (const chunk of response) {
      res.write(`${JSON.stringify({ chunk: chunk.text })}\n\n`);
    }

    res.write(`${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error) {
    console.error("Error processing chat message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
