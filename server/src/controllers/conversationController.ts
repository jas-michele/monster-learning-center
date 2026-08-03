import { Request, Response } from "express";
import { startConversation, respondToAnswer } from "../services/conversationService.js";

export async function startConversationController(
    req: Request,
    res: Response
) {


console.log("✅ startConversationController hit");
    try {
        const { childName } = req.body ?? {};

        const conversation = await startConversation(childName);

        res.status(200).json(conversation);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Unable to start conversation."
        })
    }
}

export async function respondController(req: Request, res: Response) {
    try {

        const {
            conversationState,
            category,
            itemId,
            answer
        } = req.body;

        const response = await respondToAnswer(
            conversationState,
            category,
            itemId,
            answer
        )

        console.log(req.body);
console.log(conversationState);

        res.status(200).json(response);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to process answer."
        });

    }
}