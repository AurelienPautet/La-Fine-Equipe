import dotenv from "dotenv";
dotenv.config();

import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
// import rateLimit from "express-rate-limit";

import eventsRoutes from "./routes/eventRoutes";
import tagRoutes from "./routes/tagRoutes";
import fileRoutes from "./routes/fileRoutes";
import reservationRoutes from "./routes/reservationRoutes";
import regulationRoutes from "./routes/regulationRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import authRoutes from "./routes/authRoutes";
import membersSettingsRoutes from "./routes/membersSettingsRoutes";
import divisionRoutes from "./routes/divisionRoutes";
import teamMemberRoutes from "./routes/teamMemberRoutes";
import figureRoutes from "./routes/figureRoutes";

const app = express();
app.set("trust proxy", 1);
app.use(cors());
app.use(express.json());
app.use(
  fileUpload({
    limits: { fileSize: 4.5 * 1024 * 1024 },
    abortOnLimit: true,
  })
);

// const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 6,
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: { message: "Too many login attempts. Please try again later." },
// });

// app.use("/api/auth/login", loginLimiter);

app.get("/", (_, res) => {
  res.send("Welcome to La Fine Equipe API!");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/regulations", regulationRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/members-settings", membersSettingsRoutes);
app.use("/api/divisions", divisionRoutes);
app.use("/api/team-members", teamMemberRoutes);
app.use("/api/figures", figureRoutes);

const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;
