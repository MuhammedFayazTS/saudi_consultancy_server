import express from "express";

import {
  createMedicalPayment,
  deleteMedicalPayment,
  getOneMedicalPayment,
  listMedicalPayments,
  updateMedicalPayment,
} from "../controllers/medical-payment.controller.js";
import { authGuard } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authGuard, createMedicalPayment);
router.get("/", authGuard, listMedicalPayments);
router.get("/:id", authGuard, getOneMedicalPayment);
router.put("/:id", authGuard, updateMedicalPayment);
router.delete("/:id", authGuard, deleteMedicalPayment);

export default router;
