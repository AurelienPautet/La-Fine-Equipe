import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

let embeddings: GoogleGenerativeAIEmbeddings | null = null;

export function getEmbeddings() {
  if (!embeddings) {
    embeddings = new GoogleGenerativeAIEmbeddings({
      model: "gemini-embedding-001",
      apiKey: process.env.GEMINI_API_KEY || "",
    });
  }
  return embeddings;
}

export async function testEmbeddings(): Promise<{
  success: boolean;
  dimensions: number;
  error?: string;
}> {
  try {
    const emb = getEmbeddings();
    const result = await emb.embedQuery("Test embedding generation");
    return { success: true, dimensions: result.length };
  } catch (error) {
    return {
      success: false,
      dimensions: 0,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
