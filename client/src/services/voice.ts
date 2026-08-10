let currentAudio: HTMLAudioElement | null = null;

let speechQueue: Promise<void> = Promise.resolve();

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

    currentAudio = new Audio(url);

    await new Promise<void>((resolve, reject) => {
      if (!currentAudio) {
        resolve();
        return;
      }

      currentAudio.onended = () => {
        URL.revokeObjectURL(url);
        currentAudio = null;
        resolve();
      };

      currentAudio.onerror = () => {
        URL.revokeObjectURL(url);
        currentAudio = null;
        reject(new Error("Audio playback failed"));
      };

      currentAudio.play().catch(reject);
    });
  });

  return speechQueue;
}