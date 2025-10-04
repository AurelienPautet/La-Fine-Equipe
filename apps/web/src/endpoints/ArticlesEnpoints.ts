import type { CreateArticleRequest, ArticleWithTags } from "@lafineequipe/types";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function postArticleMutation(articleData: CreateArticleRequest): Promise<ArticleWithTags> {
  const response = await fetch(`${API_URL}/api/articles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(articleData),
  });

  if (!response.ok) {
    throw new Error("Failed to create article");
  }

  const article = await response.json();
  return article;
}