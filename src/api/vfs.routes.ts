import express from "express";

import {
  createVfs,
  deleteVfs,
  getOneVfs,
  listVfss,
  updateVfs,
} from "../controllers/vfs.controller";
import { authGuard } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authGuard, createVfs);
router.get("/", authGuard, listVfss);
router.get("/:id", authGuard, getOneVfs);
router.put("/:id", authGuard, updateVfs);
router.delete("/:id", authGuard, deleteVfs);

export default router;
