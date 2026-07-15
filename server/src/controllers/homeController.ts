import { Request, Response } from "express";
import { getHomeData } from "../services/homeService.js";

export async function getHome(req: Request, res: Response) {
    try {
        const homeData = await getHomeData();

        res.status(200).json(homeData);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to load home data."
        });
    }
}