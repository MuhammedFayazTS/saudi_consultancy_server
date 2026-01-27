import express from "express";

import {
  createVisaDetails,
  deleteVisaDetails,
  getOneVisaDetails,
  listVisaDetails,
  updateVisaDetails,
} from "../controllers/visa-details.controller.js";
import { authGuard } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authGuard, createVisaDetails);
router.get("/", authGuard, listVisaDetails);
router.get("/:id", authGuard, getOneVisaDetails);
router.put("/:id", authGuard, updateVisaDetails);
router.delete("/:id", authGuard, deleteVisaDetails);

export default router;
