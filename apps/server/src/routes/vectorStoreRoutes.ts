import { Router } from "express";
import {
  postInitializeVectorStore,
  postResetVectorStore,
  getTestEmbeddings,
} from "../controllers/vectorStoreController";

const router = Router();

router.get("/test-embeddings", getTestEmbeddings);
router.post("/initialize", postInitializeVectorStore);
router.post("/reset", postResetVectorStore);

export default router;
