import express from "express";

import {
  create,
  destroy,
  getOne,
  list,
  listForSelect,
  update,
} from "../controllers/transaction.controller";
import { authGuard } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authGuard, create);
router.get("/", authGuard, list);
router.get("/select", authGuard, listForSelect);
router.get("/:id", authGuard, getOne);
router.put("/:id", authGuard, update);
router.delete("/:id", authGuard, destroy);

export default router;
