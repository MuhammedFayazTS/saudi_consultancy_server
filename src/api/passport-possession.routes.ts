import express from "express";

import {
  createPassportPossession,
  deletePassportPossession,
  getPassportPossessionById,
  listPassportPossessions,
  updatePassportPossession,
} from "../controllers/passport-possession.controller";
import { authGuard } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authGuard, createPassportPossession);
router.get("/", authGuard, listPassportPossessions);
router.get("/:id", authGuard, getPassportPossessionById);
router.put("/:id", authGuard, updatePassportPossession);
router.delete("/:id", authGuard, deletePassportPossession);

export default router;
