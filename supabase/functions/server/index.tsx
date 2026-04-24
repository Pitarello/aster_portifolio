import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
const frontendUrl = Deno.env.get('FRONTEND_URL');
app.use(
  "/*",
  cors({
    origin: frontendUrl ?? "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Global error handler
app.onError((err, c) => {
  console.error(err);
  return c.json({ error: err.message || "Erro interno do servidor" }, 500);
});

// Health check endpoint
app.get("/make-server-53751a2b/health", (c) => {
  return c.json({ status: "ok" });
});

Deno.serve(app.fetch);