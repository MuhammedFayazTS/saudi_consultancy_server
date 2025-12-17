import express from "express";

import type MessageResponse from "../interfaces/message-response.js";

const router = express.Router();

router.get<object, MessageResponse>("/", (req, res) => {
  res.json({
    message: "API is Working",
  });
});

export default router;
