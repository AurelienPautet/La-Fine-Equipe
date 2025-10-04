import dotenv from "dotenv";
dotenv.config(); // Load env vars FIRST, before other imports

import express from "express";
import cors from "cors";
import { db } from "@lafineequipe/db";
import { articles, tags, articleTags } from "@lafineequipe/db/src/schema";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Welcome to La Fine Equipe API!");
});

app.get("/api/articles", async (_, res) => {
  const allArticles = await db.select().from(articles).execute();
  res.json(allArticles);
});

app.post("/api/articles", async (req, res) => {
  const { title, content, author, tagsId } = req.body;
  const [article] = await db.insert(articles).values({ title, content, author }).returning().execute();
  console.log(article);
  for(const tagId of tagsId){
    await db.insert(articleTags).values({ articleId: article.id, tagId }).execute();
  }
  res.status(201).send("Article created!");
});

app.post("/api/tags", async (req, res) => {
  const { name } = req.body;
  await db.insert(tags).values({ name }).execute();
  res.status(201).send("Tag created!");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
