export async function speak(text: string) {
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

  const audio = new Audio(url);

  audio.onended = () => URL.revokeObjectURL(url);

  await audio.play();
}