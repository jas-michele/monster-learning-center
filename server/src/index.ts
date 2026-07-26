import dotenv from "dotenv";
dotenv.config();

console.log("JWT_SECRET =", process.env.JWT_SECRET);
import app from "./app.js"

const PORT = 5001;

app.listen(PORT, () => {
    console.log(`🚀 Server running http://localhost:${PORT}`)
});

