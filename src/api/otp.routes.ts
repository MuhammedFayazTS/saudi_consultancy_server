import { Router } from "express";
import { generateOTP, resendOTP, validateOTP } from "../controllers/otp.controller.js";
import { authGuard } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/generate", authGuard, generateOTP);
router.post("/validate", authGuard, validateOTP);
router.post("/resend", authGuard, resendOTP);

export default router;
