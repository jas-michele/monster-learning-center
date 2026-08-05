import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const apiKey = process.env.ELEVENLABS_API_KEY;
const voiceId = process.env.ELEVENLABS_VOICE_ID;

if (!apiKey) {
  throw new Error("ELEVENLABS_API_KEY is missing");
}

if (!voiceId) {
  throw new Error("ELEVENLABS_VOICE_ID is missing");
}

const client = new ElevenLabsClient({
  apiKey,
});

export async function generateSpeech(text: string) {
  return client.textToSpeech.convert(voiceId!, {
    text,
    modelId: "eleven_flash_v2_5",
  });
}