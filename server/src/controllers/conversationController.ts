import { Request, Response } from "express";
import { startConversation } from "../services/converstationService.js";

export async function startConversationController(
    req: Request,
    res: Response
) {
    try {
        const { childName } = req.body;

        const conversation = await startConversation(childName);

        res.status(200).json(conversation);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Unable to start conversation."
        })
    }
}