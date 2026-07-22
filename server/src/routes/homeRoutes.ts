import { Router } from "express";
import { getHome } from "../controllers/homeController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", authenticate, getHome);

export default router;