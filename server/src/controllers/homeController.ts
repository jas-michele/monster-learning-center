import { Request, Response } from "express";
import { getHomeData } from "../services/homeService.js";

export async function getHome(req: Request, res: Response) {
    const user = await getHomeData();

    res.json(user);
}