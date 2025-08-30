import { serve } from "@hono/node-server";
import "dotenv/config";
import { Status } from "@hey/data/enums";
import logger from "@hey/helpers/logger";
import { Hono } from "hono";
import cors from "./middlewares/cors";
import infoLogger from "./middlewares/infoLogger";
import ping from "./routes/ping";
import postsRouter from "./routes/posts";
import authRouter from "./routes/auth";
import authMiddleware from "./middlewares/authMiddleware";

const app = new Hono();

// Context
app.use(cors);
app.use(infoLogger);

// Routes
app.get("/ping", ping);
app.use("/posts/*", authMiddleware);
app.route("/posts", postsRouter);
app.route("/auth", authRouter);

app.notFound((ctx) =>
  ctx.json({ error: "Not Found", status: Status.Error }, 404)
);

serve({ fetch: app.fetch, port: 4784 }, (info) => {
  logger.info(`Server running on port ${info.port}`);
});
