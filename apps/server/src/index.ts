import dotenv from "dotenv";
dotenv.config();

import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import eventsRoutes from "./routes/eventRoutes";
import tagRoutes from "./routes/tagRoutes";
import fileRoutes from "./routes/fileRoutes";

const app = express();
app.use(cors());
app.use(express.json());
app.use(
  fileUpload({
    limits: { fileSize: 4.5 * 1024 * 1024 },
    abortOnLimit: true,
  })
);

app.get("/", (_, res) => {
  res.send("Welcome to La Fine Equipe API!");
});

// Routes
app.use("/api/events", eventsRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/files", fileRoutes);

const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;
