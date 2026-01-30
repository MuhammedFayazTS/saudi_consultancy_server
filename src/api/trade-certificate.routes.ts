import express from "express";

import {
  createTradeCertificate,
  deleteTradeCertificate,
  getOneTradeCertificate,
  listTradeCertificates,
  updateTradeCertificate,
} from "../controllers/trade-certificate.controller";
import { authGuard } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authGuard, createTradeCertificate);
router.get("/", authGuard, listTradeCertificates);
router.get("/:id", authGuard, getOneTradeCertificate);
router.put("/:id", authGuard, updateTradeCertificate);
router.delete("/:id", authGuard, deleteTradeCertificate);

export default router;
