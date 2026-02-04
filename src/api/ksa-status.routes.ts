import express from "express";

import {
  createKsaStatus,
  deleteKsaStatus,
  getOneKsaStatus,
  listKsaStatuses,
  updateKsaStatus,
} from "../controllers/ksa-status.controller";
import { authGuard } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authGuard, createKsaStatus);
router.get("/", authGuard, listKsaStatuses);
router.get("/:id", authGuard, getOneKsaStatus);
router.put("/:id", authGuard, updateKsaStatus);
router.delete("/:id", authGuard, deleteKsaStatus);

export default router;
