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

router.post("/", createMedicalPayment);
router.get("/", listMedicalPayments);
router.get("/:id", getOneMedicalPayment);
router.put("/:id", updateMedicalPayment);
router.delete("/:id", deleteMedicalPayment);

export default router;
