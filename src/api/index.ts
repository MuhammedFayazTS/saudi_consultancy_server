import express from "express";

import type MessageResponse from "../interfaces/message-response.js";

import { authGuard } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import authRoutes from "./auth.routes";
import customerRoutes from "./customer.routes";
import passportPossitionRoutes from "./passport-possition.routes.js";
import ticketRoutes from "./ticket.routes";
import transactionRoutes from "./transaction.routes.js";
import userRoutes from "./user.routes";

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
router.use("/tickets", ticketRoutes);
router.use("/passport-possition", passportPossitionRoutes);
router.use("/transaction", transactionRoutes);

export default router;
