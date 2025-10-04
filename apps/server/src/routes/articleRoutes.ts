import { Router } from "express";
import {
  getAllArticles,
  createArticle,
  getArticleBySlug,
  getLatestArticle,
} from "../controllers/articleController";

const router = Router();

router.get("/", getAllArticles);
router.get("/latest", getLatestArticle);
router.post("/", createArticle);
router.get("/:slug", getArticleBySlug);

export default router;
