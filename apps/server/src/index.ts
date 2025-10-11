import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import articleRoutes from "./routes/articleRoutes";
import tagRoutes from "./routes/tagRoutes";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Welcome to La Fine Equipe API!");
});

// Routes
app.use("/api/articles", articleRoutes);
app.use("/api/tags", tagRoutes);

const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;
