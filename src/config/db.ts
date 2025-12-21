import mongoose from "mongoose";

import { env } from "../utils/env.js";

export async function connectDB() {
  try {
    await mongoose.connect(env.MONGO_URI as string);
    // eslint-disable-next-line no-console
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
