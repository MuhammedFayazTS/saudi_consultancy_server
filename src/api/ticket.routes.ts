import express from "express";

import {
  create,
  list,
  getOne,
  update,
  listForSelect,
  destroy,
} from "../controllers/ticket.controller";
import { authGuard } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authGuard, create);
router.get("/", authGuard, list);
router.get("/select", authGuard, listForSelect);
router.get("/:id", authGuard, getOne);
router.put("/:id", authGuard, update);
router.delete("/:id", authGuard, destroy);

export default router;
