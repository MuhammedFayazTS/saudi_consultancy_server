import type { Document } from "mongoose";

import bcrypt from "bcryptjs";
import mongoose, { Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  phone: string;
  role: "admin" | "staff";
  password: string;
  matchPassword: (password: string) => Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["admin", "staff"],
      default: "staff",
    },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

/**
 * Hash password before save
 */
UserSchema.pre("save", async function (this: IUser) {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

/**
 * Custom helper
 */
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model<IUser>("User", UserSchema);
