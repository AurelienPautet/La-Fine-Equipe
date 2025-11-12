import { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import { Message } from "@lafineequipe/types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT =
  "Tu es lézard GPT, fais quelques blague en rapport avec les lézard";

export const postChat = async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    const conversationHistory = [
      {
        role: "user",
        parts: [{ text: SYSTEM_PROMPT }],
      },

      ...messages.map((msg: Message) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
    ];

    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: conversationHistory,
    });

    for await (const chunk of response) {
      res.write(`${JSON.stringify({ chunk: chunk.text })}\n\n`);
    }

    res.write(`${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error) {
    console.error("Error processing chat message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
