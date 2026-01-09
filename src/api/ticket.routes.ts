import express from "express";

import {
  createTicket,
  destroyTicket,
  getOneTicket,
  listForSelectTicket,
  listTickets,
  updateTicket,
} from "../controllers/ticket.controller";
import { authGuard } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authGuard, createTicket);
router.get("/", authGuard, listTickets);
router.get("/select", authGuard, listForSelectTicket);
router.get("/:id", authGuard, getOneTicket);
router.put("/:id", authGuard, updateTicket);
router.delete("/:id", authGuard, destroyTicket);

export default router;
