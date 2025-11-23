import { Router } from "express";
import { postInitializeVectorStore } from "../controllers/vectorStoreController";

const router = Router();

router.post("/initialize", postInitializeVectorStore);

export default router;
