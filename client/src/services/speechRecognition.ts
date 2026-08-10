class SpeechRecognitionService {
  private recognition: any = null;

  constructor() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Speech Recognition is not supported.");
      return;
    }

    this.recognition = new SpeechRecognition();

    this.recognition.lang = "en-US";
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
  }

  startListening(
    onListeningChange?: (listening: boolean) => void
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject("Speech Recognition is not available.");
        return;
      }

      onListeningChange?.(true);

      this.recognition.onresult = (event: any) => {
        onListeningChange?.(false);

        const transcript = event.results[0][0].transcript.trim();

        resolve(transcript);
      };

      this.recognition.onerror = (event: any) => {
        onListeningChange?.(false);

        reject(event.error);
      };

      this.recognition.onend = () => {
        onListeningChange?.(false);
      };

      this.recognition.start();
    });
  }

  stopListening() {
    this.recognition?.stop();
  }
}

const speechRecognitionService = new SpeechRecognitionService();

export default speechRecognitionService;