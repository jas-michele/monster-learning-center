import dotenv from "dotenv";
dotenv.config();
console.log("ELEVENLABS_API_KEY:", process.env.ELEVENLABS_API_KEY);
console.log("VOICE_ID:", process.env.ELEVENLABS_VOICE_ID);
console.log("JWT_SECRET =", process.env.JWT_SECRET);
import app from "./app.js"

const PORT = 5001;

app.listen(PORT, () => {
    console.log(`🚀 Server running http://localhost:${PORT}`)
});

