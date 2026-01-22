import express from "express";

import type MessageResponse from "../interfaces/message-response.js";

import { authGuard } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import authRoutes from "./auth.routes";
import customerRoutes from "./customer.routes";
import medicalPaymentRoutes from "./medical-payment.routes.js";
import medicalStatusRoutes from "./medical-status.routes.js";
import passportPossessionRoutes from "./passport-possession.routes.js";
import ticketRoutes from "./ticket.routes";
import transactionRoutes from "./transaction.routes.js";
import userRoutes from "./user.routes";
import vfsRoutes from "./vfs.routes.js";

const router = express.Router();

router.get<object, MessageResponse>("/", (req, res) => {
  res.json({
    message: "API is Working",
  });
});

/**
 * Test auth route
 * @route GET /test-auth
 * @middleware authGuard - for authorization
 * @middleware allowRoles("admin") -  for role-based access control
 * @returns {object} MessageResponse
 */
router.get("/test-auth", authGuard, allowRoles("admin"), (req, res) => {
  res.json({
    message: "Authorized access granted",
  });
});

// app routes
router.use("/auth", authRoutes);
router.use("/customer", customerRoutes);
router.use("/users", userRoutes);
router.use("/ticket", ticketRoutes);
router.use("/passport-possession", passportPossessionRoutes);
router.use("/transaction", transactionRoutes);
router.use("/medical-payment", medicalPaymentRoutes);
router.use("/medical-status", medicalStatusRoutes);
router.use("/vfs", vfsRoutes);

export default router;
