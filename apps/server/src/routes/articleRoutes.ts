import { Router } from "express";
import {
  getAllArticles,
  createArticle,
  getArticleBySlug,
  getLatestArticle,
  editArticle,
} from "../controllers/articleController";

const router = Router();

router.get("/", getAllArticles);
router.get("/latest", getLatestArticle);
router.post("/", createArticle);
router.get("/:slug", getArticleBySlug);
router.put("/:id", editArticle);

export default router;
