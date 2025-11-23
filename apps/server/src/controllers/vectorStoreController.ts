import { Request, Response } from "express";
import { initializeVectorStore } from "../services/vectorDbService";

export const postInitializeVectorStore = async (
  req: Request,
  res: Response
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
