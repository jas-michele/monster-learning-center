import { Router } from "express";
import { getDinoFact } from "../controllers/dinoController.js";

const router = Router();

router.post("/ask", getDinoFact);

export default router;