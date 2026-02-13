import { Router } from "express";
import {
  postInitializeVectorStore,
  postResetVectorStore,
} from "../controllers/vectorStoreController";

const router = Router();

router.post("/initialize", postInitializeVectorStore);
router.post("/reset", postResetVectorStore);

export default router;
