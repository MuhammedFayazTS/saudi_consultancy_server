import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import type MessageResponse from "./interfaces/message-response.js";

import api from "./api/index.js";
import { loadOpenApiSpec } from "./config/swagger.js";
import * as middlewares from "./middlewares/middlewares.js";
import { env } from "./utils/env.js";

const app = express();

app.use(morgan("dev"));
app.use(helmet());
const allowedOrigins = env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

app.get<object, MessageResponse>("/", (req, res) => {
  res.json({
    message: "Server is alive",
  });
});

app.use("/api/v1", api);

// Swagger docs
const openApiSpec = loadOpenApiSpec();

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
