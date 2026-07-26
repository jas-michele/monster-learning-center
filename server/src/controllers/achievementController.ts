import { Request, Response } from "express";
import { getAchievements } from "../services/achievementService.js";

export async function getUserAchievements(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const achievements = await getAchievements(req.user.id);

        res.status(200).json({
            achievements,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to retrieve achievements"
        });
    }
}