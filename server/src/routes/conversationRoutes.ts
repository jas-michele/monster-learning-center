import { Router } from "express";
import { startConversationController, respondController } from "../controllers/conversationController.js";

const router = Router();

router.post(
    "/start",
    startConversationController
);

router.post(
    "/respond",
    respondController
);

export default router;