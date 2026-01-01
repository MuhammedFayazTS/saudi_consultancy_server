import mongoose from "mongoose";
import { ITransaction, Transaction } from "../models/transaction.model";

export const createTransaction = async (data: ITransaction, session?: mongoose.ClientSession) => {
  try {
    const transaction = new Transaction(data);
    return await transaction.save(session ? { session } : {});
  } catch (error) {
    console.log(error);
    throw error;
  }
};
