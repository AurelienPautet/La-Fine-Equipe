import { InferSelectModel } from 'drizzle-orm';
import { articles } from '@lafineequipe/db/src/schema';

export type Article = InferSelectModel<typeof articles>;

export interface ArticleWithTags extends Article {
  tags: (number | null)[];
}

export interface CreateArticleRequest {
  title: string;
  content: string;
  author: string;
  tagsId: number[];
}
