import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

let embeddings: GoogleGenerativeAIEmbeddings | null = null;

export function getEmbeddings() {
  if (!embeddings) {
    const apiKey = process.env.GEMINI_API_KEY || "";
    console.log(
      `[Embeddings] Initializing with API key: ${apiKey ? "present" : "MISSING"}`,
    );
    embeddings = new GoogleGenerativeAIEmbeddings({
      model: "models/embedding-001",
      apiKey: apiKey,
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
    console.log("[Embeddings] Testing with sample text...");
    const result = await emb.embedQuery("Test embedding generation");
    console.log(`[Embeddings] Test result: ${result.length} dimensions`);
    return { success: true, dimensions: result.length };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[Embeddings] Test failed:", errorMessage);
    return { success: false, dimensions: 0, error: errorMessage };
  }
}
