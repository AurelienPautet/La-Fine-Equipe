
import { InferSelectModel } from 'drizzle-orm';
import { tags } from '@lafineequipe/db/src/schema';

export type Tag = InferSelectModel<typeof tags>;

export interface CreateTagRequest {
  name: string;
}
