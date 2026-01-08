import express from "express";

import {
  createPassportPossition,
  deletePassportPossition,
  listPassportPossitions,
  updatePassportPossition,
} from "../controllers/passport-possition.controller";
import { authGuard } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authGuard, createPassportPossition);
router.get("/", authGuard, listPassportPossitions);
router.put("/:id", authGuard, updatePassportPossition);
router.delete("/:id", authGuard, deletePassportPossition);

export default router;
