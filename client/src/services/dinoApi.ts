export type DinoTopic =
  | "facts"
  | "habitat"
  | "diet"
  | "size";

type DinoResponse = {
  dinosaur: string;
  topic: DinoTopic;
  message: string;
};

export async function getDinoFact(
  dinosaur: string,
  topic: DinoTopic
): Promise<DinoResponse> {
  const response = await fetch(
    "http://localhost:5001/api/dino/ask",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dinosaur,
        topic,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get dinosaur fact.");
  }

  return response.json();
}