import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";

import { HTTPSTATUS } from "../constants/httpstatus.js";
import { User } from "../models/user.model";

export const listUsers = asyncHandler(async (req: Request, res: Response) => {
    const {
        page = "1",
        limit = "10",
        sortBy = "createdAt",
        sortOrder = "desc",
        search,
        ...rest
    } = req.query as Record<string, any>;

    const pageNum = Math.max(1, Number.parseInt(String(page), 10) || 1);
    const limitNum = Math.min(100, Math.max(1, Number.parseInt(String(limit), 10) || 10));

    const query: any = {};
    if (rest.role !== undefined && rest.role !== "")
        query.role = rest.role;

    const { fields } = req.query;
    let projection = "-password"; // always exclude password
    if (fields) {
        const allowedReturnFields = ["_id", "username", "email", "phone", "role", "createdAt", "updatedAt"];
        const selected = String(fields)
            .split(",")
            .map(s => s.trim())
            .filter(s => s && allowedReturnFields.includes(s));
        if (selected.length)
            projection = selected.join(" ");
    }

    // Search across username, email, phone
    if (search) {
        const s = String(search).trim();
        const esc = s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(esc, "i");
        query.$or = [{ username: regex }, { email: regex }, { phone: regex }];
    }

    const sort: Record<string, 1 | -1> = {};
    sort[String(sortBy)] = String(sortOrder).toLowerCase() === "asc" ? 1 : -1;

    const total = await User.countDocuments(query);
    const pages = Math.max(1, Math.ceil(total / limitNum));
    const users = await User.find(query)
        .sort(sort)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .select(projection)
        .lean();

    res.status(HTTPSTATUS.OK).json({
        data: users,
        meta: {
            total,
            page: pageNum,
            pages,
            limit: limitNum,
        },
    });
});