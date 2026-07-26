import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;

export async function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Authorization header is required."
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Token is required"
            })
        }

        console.log("========== AUTH ==========");
        console.log("Authorization:", authHeader);
        console.log("Token:", token);

        const decoded = jwt.verify(
            token,
            JWT_SECRET
        ) as Express.UserPayload;

        console.log("Decoded JWT", decoded);

        req.user = decoded;

        next();

    } catch (error) {
        console.error("JWT VERIFY ERROR:", error)

        return res.status(401).json({
            message: "Invalid or expired token."
        })

    }
}