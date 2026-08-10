export function normalizeSpeech(
  text: string,
  category: string
) {
  const value = text.trim().toLowerCase();

  if (category === "numbers") {
    const numbers: Record<string, string> = {
      zero: "0",
      one: "1",
      two: "2",
      three: "3",
      four: "4",
      five: "5",
      six: "6",
      seven: "7",
      eight: "8",
      nine: "9",
      ten: "10",
    };

    return numbers[value] ?? value;
  }

  if (category === "letters") {
    const letters: Record<string, string> = {
      aye: "A",
      bee: "B",
      be: "B",
      see: "C",
      sea: "C",
      dee: "D",
      gee: "G",
      jay: "J",
      kay: "K",
      em: "M",
      en: "N",
      cue: "Q",
      are: "R",
      you: "U",
      why: "Y",
      zee: "Z",
      zed: "Z",
    };

    return (letters[value] ?? value).toUpperCase();
  }

  // Colors and shapes
  return value;
}