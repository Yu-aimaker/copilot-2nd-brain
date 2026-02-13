import express from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./router";

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(cors());
app.use(express.json());

// ─── Health check ────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "2nd-brain-api" });
});

// ─── tRPC ────────────────────────────────────────────────────
app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
  })
);

app.listen(PORT, () => {
  console.log(`🧠 2nd Brain API running on http://localhost:${PORT}`);
});

export type { AppRouter } from "./router";
