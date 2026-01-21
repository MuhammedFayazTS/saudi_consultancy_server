import express from "express";

import {
  createMedicalStatus,
  deleteMedicalStatus,
  getOneMedicalStatus,
  listMedicalStatuss,
  updateMedicalStatus,
} from "../controllers/medical-status.controller";
import { authGuard } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authGuard, createMedicalStatus);
router.get("/", authGuard, listMedicalStatuss);
router.get("/:id", authGuard, getOneMedicalStatus);
router.put("/:id", authGuard, updateMedicalStatus);
router.delete("/:id", authGuard, deleteMedicalStatus);

export default router;
