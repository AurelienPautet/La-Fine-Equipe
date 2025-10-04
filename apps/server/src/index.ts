import dotenv from "dotenv";
dotenv.config(); // Load env vars FIRST, before other imports

import express from "express";
import cors from "cors";
import { db } from "@lafineequipe/db";
import { articles } from "@lafineequipe/db/src/schema";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Welcome to La Fine Equipe API!");
});

// Fetch all articles
app.get("/api/articles", async (_, res) => {
  const allArticles = await db.select().from(articles).execute();
  res.json(allArticles);
});

// Create an article
app.post("/api/articles", async (req, res) => {
  const { title, content, author } = req.body;
  await db.insert(articles).values({ title, content, author }).execute();
  res.status(201).send("Article created!");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
