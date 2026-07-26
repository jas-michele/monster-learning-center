import { Router } from "express";
import { register, login, currentUser} from "../controllers/authController.js"
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.get(
    "/me",
    authenticate,currentUser
);

export default router;