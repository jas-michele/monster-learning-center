import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { getUserAchievements } from "../controllers/achievementController.js";

const router = Router();

router.get(
    "/",
    authenticate,
    getUserAchievements
);

export default router;