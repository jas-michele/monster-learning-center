import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { json } from "stream/consumers";

import homeRoutes from "./routes/homeRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/home", homeRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (_req, res) => {
    res.send(" 🚙 Monster Learning Center API is running!")
});


export default app;