class SpeechRecognitionService {
  private recognition: any = null;
  private isListening = false;

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

      // Prevent recognition.start() from being called twice
      if (this.isListening) {
        console.log("Speech recognition is already listening.");
        reject(new Error("Speech recognition is already listening."));
        return;
      }

      this.isListening = true;
      onListeningChange?.(true);

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.trim();

        this.isListening = false;
        onListeningChange?.(false);

        resolve(transcript);
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        onListeningChange?.(false);

        reject(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        onListeningChange?.(false);
      };

      try {
        this.recognition.start();
      } catch (error) {
        this.isListening = false;
        onListeningChange?.(false);
        reject(error);
      }
    });
  }

  stopListening() {
    if (!this.recognition || !this.isListening) {
      return;
    }

    this.recognition.stop();
    this.isListening = false;
  }
}

const speechRecognitionService = new SpeechRecognitionService();

export default speechRecognitionService;