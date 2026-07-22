import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/authService.js";

export async function register(req: Request, res: Response) {
    try {
        const { firstName, lastName, email, password} = req.body;

        const result = await registerUser(
            firstName,
            lastName,
            email,
            password
        );

        res.status(201).json(result);
    }  catch (error) {
        console.error(error);

        if (error instanceof Error) {
            return res.status(400).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: "Registration failed."
        })
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password} = req.body;

        const result = await loginUser(email, password);

        res.status(200).json(result);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            return res.status(401).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: "Login failed."
        })
    }
}