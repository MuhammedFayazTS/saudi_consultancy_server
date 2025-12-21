import express from "express";

import { loggedInUser, login, register } from "../controllers/auth.controller";
import { authGuard } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/loggedin-user", authGuard, loggedInUser);

export default router;
