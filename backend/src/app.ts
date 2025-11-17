import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";
import { authenticate } from "./middleware/authMiddleware";
import { errorHandler, notFound } from "./middleware/errorHandler";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (_req, res) => {
  res.json({ status: "ok,app backend is running successfully" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", authenticate, taskRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;

