import express from "express";

import cors from "cors";


import homeRoutes from "./routes/homeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js"



const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/home", homeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/achievements", achievementRoutes);

app.get("/", (_req, res) => {
    res.send(" 🚙 Monster Learning Center API is running!")
});


export default app;