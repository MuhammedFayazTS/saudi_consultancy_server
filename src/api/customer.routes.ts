import express from "express";

import {
  createCustomer,
  deleteCustomer,
  getOneCustomer,
  listCustomers,
  listForSelectCustomers,
  updateCustomer,
} from "../controllers/customer.controller";
import { authGuard } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authGuard, createCustomer);
router.get("/", authGuard, listCustomers);
router.get("/select", authGuard, listForSelectCustomers);
router.get("/:id", authGuard, getOneCustomer);
router.put("/:id", authGuard, updateCustomer);
router.delete("/:id", authGuard, deleteCustomer);

export default router;
