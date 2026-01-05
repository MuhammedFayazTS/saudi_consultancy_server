import type { Request, Response } from "express";
import type { ObjectId } from "mongoose";

import asyncHandler from "express-async-handler";

import { HTTPSTATUS } from "../constants/httpstatus.js";
import { PassportPossition } from "../models/passport-possition.model.js";
import { PassportPossitionZodSchema } from "../utils/validators/passport-possition.schema.js";

export const createPassportPossition = asyncHandler(async (req: Request, res: Response) => {
    const inputParams = PassportPossitionZodSchema.parse(req.body);

    const { transactionId, ...rest } = inputParams;
    const parsedTransactionId = transactionId as unknown as ObjectId;

    const passportPossition = await PassportPossition.create({ ...rest, transactionId: parsedTransactionId });

    res.status(HTTPSTATUS.CREATED).json({ message: "Passport Possition registered successfully", passportPossition });
});

export const updatePassportPossition = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const inputParams = PassportPossitionZodSchema.partial().parse(req.body);

        delete (inputParams as any).transactionId;

        const passportPossition = await PassportPossition.findByIdAndUpdate(
            id,
            { $set: inputParams },
            { new: true, runValidators: true }
        );

        if (!passportPossition) {
            res
                .status(HTTPSTATUS.NOT_FOUND)
                .json({ message: "Passport Possition not found" });
            return;
        }

        res.status(HTTPSTATUS.OK).json({
            message: "Passport Possition updated successfully",
            passportPossition,
        });
    }
);

export const listPassportPossitions = asyncHandler(
    async (req: Request, res: Response) => {
        const { transactionId } = req.query;

        const filter: Record<string, any> = {};

        if (transactionId) {
            filter.transactionId = transactionId;
        }

        const passportPossitions = await PassportPossition.find(filter)
            .sort({ createdAt: -1 });

        res.status(HTTPSTATUS.OK).json({
            count: passportPossitions.length,
            passportPossitions,
        });
    }
);

export const deletePassportPossition = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const passportPossition = await PassportPossition.findByIdAndDelete(id);

        if (!passportPossition) {
            res
                .status(HTTPSTATUS.NOT_FOUND)
                .json({ message: "Passport Possition not found" });
            return;
        }

        res.status(HTTPSTATUS.OK).json({
            message: "Passport Possition deleted successfully",
        });
    }
);
