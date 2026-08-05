import { Router } from "express";
import  { generateVoice } from "../controllers/voiceController.js"

const router = Router();

router.post("/", generateVoice);

export default router;