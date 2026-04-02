import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "@workspace/db";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();
const isProd = process.env.NODE_ENV === "production";
const PgSession = connectPgSimple(session);

// Trust Vercel's reverse proxy so secure cookies work over HTTPS
if (isProd) {
  app.set("trust proxy", 1);
}

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL]
  : true;

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: isProd
      ? new PgSession({
          pool,
          tableName: "session",
          createTableIfMissing: true,
        })
      : undefined,
    secret: process.env.SESSION_SECRET ?? "dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
    },
  }),
);

app.use("/api", router);

app.use((err: Error & { code?: string; status?: number; cause?: Error & { code?: string } }, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status ?? 500;
  logger.error({ err }, "Unhandled error");
  res.status(status).json({
    error: err.message ?? "Internal Server Error",
    code: err.code,
    cause: err.cause?.message,
    causeCode: err.cause?.code,
  });
});

export default app;
