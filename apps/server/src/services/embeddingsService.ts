import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

let embeddings: GoogleGenerativeAIEmbeddings | null = null;

export function getEmbeddings() {
  if (!embeddings) {
    const apiKey = process.env.GEMINI_API_KEY || "";
    embeddings = new GoogleGenerativeAIEmbeddings({
      model: "models/embedding-001",
      apiKey: apiKey,
    });
  }
  return embeddings;
}
