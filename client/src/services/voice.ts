let currentAudio: HTMLAudioElement | null = null;
let currentAudioUrl: string | null = null;

let speechQueue: Promise<void> = Promise.resolve();

export function unlockAudio() {
  const audio = new Audio();

  audio.muted = true;

  audio
    .play()
    .then(() => {
      audio.pause();
      audio.currentTime = 0;
    })
    .catch((error) => {
      console.warn("Audio unlock failed:", error);
    });
}

export function speak(text: string): Promise<void> {
  speechQueue = speechQueue.then(async () => {
    const response = await fetch("http://localhost:5001/api/voice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error("Voice request failed");
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    currentAudioUrl = url;
    currentAudio = new Audio(url);

    await new Promise<void>((resolve, reject) => {
      if (!currentAudio) {
        resolve();
        return;
      }

      currentAudio.onended = () => {
        URL.revokeObjectURL(url);

        currentAudio = null;
        currentAudioUrl = null;

        resolve();
      };

      currentAudio.onerror = () => {
        URL.revokeObjectURL(url);

        currentAudio = null;
        currentAudioUrl = null;

        reject(new Error("Audio playback failed"));
      };

      currentAudio.play().catch(reject);
    });
  });

  return speechQueue;
}

export function stopSpeaking() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }

  if (currentAudioUrl) {
    URL.revokeObjectURL(currentAudioUrl);
    currentAudioUrl = null;
  }

  speechQueue = Promise.resolve();
}