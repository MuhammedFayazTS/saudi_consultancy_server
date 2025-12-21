import type { Secret, SignOptions } from "jsonwebtoken";

import jwt from "jsonwebtoken";

import { env } from "./env.js";

export function generateToken(payload: object) {
  const jwtOptions: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as unknown as number | undefined,
  };
  return jwt.sign(payload, env.JWT_SECRET as Secret, jwtOptions);
}
