import express from "express";

import { createPassportPossition, deletePassportPossition, listPassportPossitions, updatePassportPossition } from "../controllers/passport-possition.controller";

const router = express.Router();

router.post("/", createPassportPossition);
router.get("/", listPassportPossitions);
router.put("/:id", updatePassportPossition);
router.delete("/:id", deletePassportPossition);

export default router;
