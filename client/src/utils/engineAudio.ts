type EngineRevAudio = {
  context: AudioContext;
  engineOscillator: OscillatorNode;
  revPulse: OscillatorNode;
  gain: GainNode;
};

let activeEngineRev: EngineRevAudio | null = null;
let effectsContext: AudioContext | null = null;
let stopTimer: number | undefined;

function getAudioContextConstructor() {
  return (
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  );
}

function clearScheduledStop() {
  if (stopTimer === undefined) return;

  window.clearTimeout(stopTimer);
  stopTimer = undefined;
}

function resumeActiveEngineRev() {
  if (!activeEngineRev || activeEngineRev.context.state === "running") return;

  void activeEngineRev.context.resume().catch(() => undefined);
}

function resumeEffectsContext() {
  if (!effectsContext || effectsContext.state === "running") return;

  void effectsContext.resume().catch(() => undefined);
}

function getEffectsContext() {
  const AudioContextConstructor = getAudioContextConstructor();

  if (!AudioContextConstructor) return null;

  effectsContext ??= new AudioContextConstructor();
  resumeEffectsContext();

  return effectsContext;
}

function addUnlockListeners() {
  const unlock = () => {
    resumeActiveEngineRev();
    resumeEffectsContext();
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
  };

  window.addEventListener("pointerdown", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
}

export function startEngineRev() {
  clearScheduledStop();

  if (activeEngineRev) {
    resumeActiveEngineRev();
    return;
  }

  const AudioContextConstructor = getAudioContextConstructor();

  if (!AudioContextConstructor) return;

  const audioContext = new AudioContextConstructor();
  const engineOscillator = audioContext.createOscillator();
  const revPulse = audioContext.createOscillator();
  const lowPass = audioContext.createBiquadFilter();
  const gain = audioContext.createGain();
  const pulseGain = audioContext.createGain();

  engineOscillator.type = "sawtooth";
  engineOscillator.frequency.setValueAtTime(58, audioContext.currentTime);
  engineOscillator.frequency.linearRampToValueAtTime(88, audioContext.currentTime + 3.2);

  revPulse.type = "sine";
  revPulse.frequency.setValueAtTime(7.5, audioContext.currentTime);
  pulseGain.gain.setValueAtTime(10, audioContext.currentTime);
  revPulse.connect(pulseGain);
  pulseGain.connect(engineOscillator.frequency);

  lowPass.type = "lowpass";
  lowPass.frequency.setValueAtTime(190, audioContext.currentTime);
  lowPass.frequency.linearRampToValueAtTime(360, audioContext.currentTime + 3.2);

  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.035, audioContext.currentTime + 0.12);
  gain.gain.exponentialRampToValueAtTime(0.055, audioContext.currentTime + 3.1);

  engineOscillator.connect(lowPass);
  lowPass.connect(gain);
  gain.connect(audioContext.destination);

  engineOscillator.start();
  revPulse.start();

  activeEngineRev = {
    context: audioContext,
    engineOscillator,
    revPulse,
    gain,
  };

  resumeActiveEngineRev();
  addUnlockListeners();
}

export function stopEngineRev() {
  clearScheduledStop();

  if (!activeEngineRev) return;

  const { context, engineOscillator, revPulse, gain } = activeEngineRev;
  activeEngineRev = null;

  const stopTime = context.currentTime + 0.08;
  gain.gain.cancelScheduledValues(context.currentTime);
  gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, stopTime);

  engineOscillator.stop(stopTime);
  revPulse.stop(stopTime);

  window.setTimeout(() => {
    void context.close().catch(() => undefined);
  }, 140);
}

export function scheduleEngineRevStop() {
  clearScheduledStop();
  stopTimer = window.setTimeout(() => {
    stopEngineRev();
  }, 250);
}

function makeNoiseBuffer(context: AudioContext, duration: number) {
  const sampleCount = Math.floor(context.sampleRate * duration);
  const buffer = context.createBuffer(1, sampleCount, context.sampleRate);
  const samples = buffer.getChannelData(0);

  for (let index = 0; index < sampleCount; index++) {
    samples[index] = Math.random() * 2 - 1;
  }

  return buffer;
}

export function playPuddleSplash() {
  const context = getEffectsContext();

  if (!context) return;

  const now = context.currentTime;
  const splashNoise = context.createBufferSource();
  const splashFilter = context.createBiquadFilter();
  const splashGain = context.createGain();
  const droplet = context.createOscillator();
  const dropletGain = context.createGain();

  splashNoise.buffer = makeNoiseBuffer(context, 0.55);
  splashFilter.type = "bandpass";
  splashFilter.frequency.setValueAtTime(880, now);
  splashFilter.frequency.exponentialRampToValueAtTime(260, now + 0.38);
  splashFilter.Q.setValueAtTime(1.4, now);

  splashGain.gain.setValueAtTime(0.0001, now);
  splashGain.gain.exponentialRampToValueAtTime(0.18, now + 0.025);
  splashGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.52);

  droplet.type = "sine";
  droplet.frequency.setValueAtTime(1180, now + 0.04);
  droplet.frequency.exponentialRampToValueAtTime(420, now + 0.22);
  dropletGain.gain.setValueAtTime(0.0001, now);
  dropletGain.gain.exponentialRampToValueAtTime(0.05, now + 0.06);
  dropletGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

  splashNoise.connect(splashFilter);
  splashFilter.connect(splashGain);
  splashGain.connect(context.destination);
  droplet.connect(dropletGain);
  dropletGain.connect(context.destination);

  splashNoise.start(now);
  splashNoise.stop(now + 0.56);
  droplet.start(now + 0.04);
  droplet.stop(now + 0.3);
}

export function playCrowdCheer() {
  const context = getEffectsContext();

  if (!context) return;

  const now = context.currentTime;
  const voiceFilter = context.createBiquadFilter();
  const masterGain = context.createGain();

  voiceFilter.type = "bandpass";
  voiceFilter.frequency.setValueAtTime(1450, now);
  voiceFilter.Q.setValueAtTime(0.9, now);
  masterGain.gain.setValueAtTime(0.0001, now);
  masterGain.gain.exponentialRampToValueAtTime(0.16, now + 0.05);
  masterGain.gain.setValueAtTime(0.14, now + 0.55);
  masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

  voiceFilter.connect(masterGain);
  masterGain.connect(context.destination);

  [420, 500, 595, 710].forEach((frequency, index) => {
    const voice = context.createOscillator();
    const voiceGain = context.createGain();
    const startTime = now + index * 0.035;

    voice.type = "triangle";
    voice.frequency.setValueAtTime(frequency, startTime);
    voice.frequency.linearRampToValueAtTime(frequency * 0.82, startTime + 0.08);
    voice.frequency.linearRampToValueAtTime(frequency * 1.42, startTime + 0.62);
    voiceGain.gain.setValueAtTime(0.0001, startTime);
    voiceGain.gain.exponentialRampToValueAtTime(0.045, startTime + 0.035);
    voiceGain.gain.setValueAtTime(0.035, startTime + 0.32);
    voiceGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.02);

    voice.connect(voiceGain);
    voiceGain.connect(voiceFilter);
    voice.start(startTime);
    voice.stop(startTime + 1.06);
  });
}
