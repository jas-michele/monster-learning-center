import { Router } from "express";
import { startConversationController } from "../controllers/conversationController.js";

const router = Router();

router.post(
    "/start",
    startConversationController
);

export default router;