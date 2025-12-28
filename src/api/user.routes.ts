import express from "express";

import { listUsers } from "../controllers/user.controller";
import { authGuard } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", authGuard, listUsers);

export default router;
