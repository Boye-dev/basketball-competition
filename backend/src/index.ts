import express, { Application } from "express";
import cors from "cors";
import { NotFoundError, TooManyRequestsError } from "./utils/responseHandler";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import config from "./config";
import { Server as HttpServer } from "http";
import { connectDB } from "./db";
import routes from "./routes";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import pinoHttp from "pino-http";
import logger from "./utils/logger";
import { randomUUID } from "crypto";

class Server {
  private app: Application;
  private httpServer: HttpServer;

  constructor() {
    this.app = express();
    this.httpServer = new HttpServer(this.app);
    this.initializeDb();
    this.initializeMiddlewaresAndRoutes();
  }

  private async initializeDb() {
    await connectDB();
  }

  private initializeMiddlewaresAndRoutes() {
    this.app.use(
      pinoHttp({
        logger,
        serializers: {
          req: (req) => ({
            id: req.id,
            method: req.method,
            url: req.url,
            remoteAddress: req.remoteAddress,
            remotePort: req.remotePort,
          }),
          res: (res) => ({
            statusCode: res.statusCode,
          }),
        },
        genReqId: (_req, res) => {
          const requestId = randomUUID();
          res.setHeader("x-request-id", requestId);
          return requestId;
        },
      }),
    );

    const allowedOrigins = [config.frontendUrl, config.adminUrl].filter(
      Boolean,
    );

    this.app.use(
      cors({
        origin: allowedOrigins,
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      }),
    );

    this.app.options(
      "/*splat",
      cors({
        origin: allowedOrigins,
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      }),
    );

    this.app.use(
      helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
        crossOriginOpenerPolicy: false,
      }),
    );

    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res) => {
        res
          .status(429)
          .json(
            new TooManyRequestsError(
              "Too many requests from this IP, please try again in 15 minutes!",
            ),
          );
      },
    });
    this.app.use(limiter);
    this.app.use(compression());
    this.app.use(express.json({ limit: "5mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "5mb" }));

    this.app.use("/", routes);

    this.app.all("/*splat", (req, _res, next) => {
      next(new NotFoundError(`Can't find ${req.originalUrl} on the server!`));
    });

    this.app.use(globalErrorHandler);
  }

  public start() {
    this.httpServer.listen(config.port, () => {
      logger.info(`Server is listening on port ${config.port}...`);
    });
  }
}

const server = new Server();
server.start();
