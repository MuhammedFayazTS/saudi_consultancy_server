import express from "express";

import type MessageResponse from "../interfaces/message-response.js";

import authRoutes from "./auth.routes";

const router = express.Router();

router.get<object, MessageResponse>("/", (req, res) => {
  res.json({
    message: "API is Working",
  });
});

router.use("/auth", authRoutes);

export default router;
