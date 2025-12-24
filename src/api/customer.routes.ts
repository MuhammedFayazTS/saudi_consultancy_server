import express from "express";

import {
  create,
  list,
  getOne,
  update,
  listForSelect,
  destroy,
} from "../controllers/customer.controller";
import { authGuard } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authGuard, create);
router.get("/", authGuard, list);
router.get("/select", authGuard, listForSelect);
router.get("/customers/:id", authGuard, getOne);
router.put("/customers/:id", authGuard, update);
router.delete("/customers/:id", authGuard, destroy);

export default router;
