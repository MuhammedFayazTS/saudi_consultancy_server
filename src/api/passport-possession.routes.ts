import express from "express";

import {
  createPassportPossession,
  deletePassportPossession,
  listPassportPossessions,
  updatePassportPossession,
} from "../controllers/passport-possession.controller";
import { authGuard } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authGuard, createPassportPossession);
router.get("/", authGuard, listPassportPossessions);
router.put("/:id", authGuard, updatePassportPossession);
router.delete("/:id", authGuard, deletePassportPossession);

export default router;
