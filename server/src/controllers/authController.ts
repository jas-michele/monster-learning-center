import { Request, Response } from "express";
import { loginUser, registerUser, getCurrentUser } from "../services/authService.js";

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

export const currentUser = async(
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const user = await getCurrentUser(req.user.id);

        if (!user) {
            res.status(404).json({
                message: "User not found",
            });
            return;
        }

        res.status(200).json({
           user,
        })
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to retrieve user",
        });
    }
};

