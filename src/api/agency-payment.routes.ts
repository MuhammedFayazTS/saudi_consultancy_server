import express from "express";

import {
  createAgencyPayment,
  deleteAgencyPayment,
  getOneAgencyPayment,
  listAgencyPayment,
  updateAgencyPayment,
} from "../controllers/agency-payment.controller.js";
import { authGuard } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authGuard, createAgencyPayment);
router.get("/", authGuard, listAgencyPayment);
router.get("/:id", authGuard, getOneAgencyPayment);
router.put("/:id", authGuard, updateAgencyPayment);
router.delete("/:id", authGuard, deleteAgencyPayment);

export default router;
