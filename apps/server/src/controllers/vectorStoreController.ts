import { Request, Response } from "express";
import {
  initializeVectorStore,
  resetVectorStore,
} from "../services/vectorDbService";
import { testEmbeddings } from "../services/embeddingsService";

export const postInitializeVectorStore = async (
  req: Request,
  res: Response,
) => {
  try {
    console.log("Manual vector store initialization requested...");
    await initializeVectorStore();
    res.status(200).json({
      success: true,
      message: "Vector store initialized successfully",
    });
  } catch (error) {
    console.error("Failed to initialize vector store:", error);
    res.status(500).json({
      success: false,
      message: "Failed to initialize vector store",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export async function postResetVectorStore(req: Request, res: Response) {
  try {
    console.log("Manual vector store reset requested...");
    await resetVectorStore();
    res.status(200).json({
      success: true,
      message: "Vector store reset successfully",
    });
  } catch (error) {
    console.error("Failed to reset vector store:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset vector store",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getTestEmbeddings(req: Request, res: Response) {
  try {
    console.log("Testing embeddings...");
    const result = await testEmbeddings();
    if (result.success) {
      res.status(200).json({
        success: true,
        message: "Embeddings working correctly",
        dimensions: result.dimensions,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Embeddings test failed",
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Failed to test embeddings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to test embeddings",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
