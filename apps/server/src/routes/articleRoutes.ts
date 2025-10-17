import { Router } from "express";
import {
  getAllArticles,
  createArticle,
  getArticleBySlug,
  getLatestsArticle,
  editArticle,
} from "../controllers/articleController";

const router = Router();

router.get("/", getAllArticles);
router.get("/latests", getLatestsArticle);
router.post("/", createArticle);
router.get("/:slug", getArticleBySlug);
router.put("/:id", editArticle);

export default router;
