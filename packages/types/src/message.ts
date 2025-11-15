export interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  reasoningContent?: string;
  timestamp: number;
}
