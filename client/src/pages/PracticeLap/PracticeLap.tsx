import "./PracticeLap.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import PracticeTrack from "../../components/PracticeTrack";
import type { TruckColor } from "../Mechanic/truckCustomization";

import completeTruck from "../../assets/mechanic/blackTruck.png";
import redCompleteTruck from "../../assets/mechanic/redTruck.png";
import blueCompleteTruck from "../../assets/mechanic/blueTruck.png";
import greenCompleteTruck from "../../assets/mechanic/greenTruck.png";
import purpleCompleteTruck from "../../assets/mechanic/purpleTruck.png";
import lapAssets from "../../assets/lapassets.png";
import raceAvatar from "../../assets/avatars/race.png";

import Countdown from "../../components/Countdown/Countdown";

function startEngineRev() {
    const AudioContextConstructor =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextConstructor) return undefined;

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
    void audioContext.resume().catch(() => undefined);

    return () => {
        const stopTime = audioContext.currentTime + 0.08;
        gain.gain.cancelScheduledValues(audioContext.currentTime);
        gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, stopTime);
        engineOscillator.stop(stopTime);
        revPulse.stop(stopTime);
        window.setTimeout(() => {
            void audioContext.close().catch(() => undefined);
        }, 140);
    };
}

export default function PracticeLap() {

    const savedTruck = localStorage.getItem("monsterTruckCustomization");
    const [countdown, setCountdown] = useState("3");
    const [driving, setDriving] = useState(false);

    const truckData = savedTruck
        ? JSON.parse(savedTruck)
        : null;

    const completeTruckAssets: Record<TruckColor, string> = {
        black: completeTruck,
        red: redCompleteTruck,
        blue: blueCompleteTruck,
        green: greenCompleteTruck,
        purple: purpleCompleteTruck,
    };

    const savedBodyColor = truckData?.customization?.bodyColor;
    const bodyColor: TruckColor =
        typeof savedBodyColor === "string" && savedBodyColor in completeTruckAssets
            ? savedBodyColor as TruckColor
            : "black";

    useEffect(() => {
        const values = ["3", "2", "1", "GO!"];
        const stopEngineRev = startEngineRev();

        let index = 0;

        const timer = setInterval(() => {
            index++;

            if (index < values.length) {
                setCountdown(values[index]);
            } else {
                clearInterval(timer);
                stopEngineRev?.();

                setTimeout(() => {
                    setCountdown("");
                    setDriving(true);
                }, 1000);
            }
        }, 1000);

        return () => {
            clearInterval(timer);
            stopEngineRev?.();
        };
    }, []);


    return (
        <main className="practice-lap">
            <PracticeTrack />

            <Link className="practice-lap-nav practice-lap-nav--mechanic" to="/mechanic" aria-label="Return to mechanic shop">
                <FaSignOutAlt aria-hidden />
            </Link>

            <Link className="practice-lap-nav practice-lap-nav--playhouse" to="/home" aria-label="Return to playhouse">
                <FaSignOutAlt aria-hidden />
            </Link>

            <Countdown value={countdown} />

            <div className={`practice-lap-effects ${driving ? "practice-lap-effects--active" : ""}`} aria-hidden>
                <div className="practice-lap-obstacle practice-lap-obstacle--mound" style={{ backgroundImage: `url(${lapAssets})` }} />
                <div className="practice-lap-obstacle practice-lap-obstacle--puddle" style={{ backgroundImage: `url(${lapAssets})` }} />
                <div className="practice-lap-splash" />
                <div className="practice-lap-finished" style={{ backgroundImage: `url(${lapAssets})` }} />
                <div className="practice-lap-confetti">
                    {Array.from({ length: 28 }, (_, index) => (
                        <span key={index} />
                    ))}
                </div>
            </div>

            <div className={`practice-truck-runner ${countdown && !driving ? "practice-truck-runner--revving" : ""} ${driving ? "practice-truck-runner--driving" : ""}`}>
                <div className="practice-truck-stack">
                    <div className="practice-truck-smoke" aria-hidden>
                        <span />
                        <span />
                        <span />
                        <span />
                    </div>
                    <div className="practice-truck-driver" aria-hidden>
                        <img src={raceAvatar} alt="" />
                    </div>
                    <img
                        className="practice-truck"
                        src={completeTruckAssets[bodyColor]}
                        alt="Monster Truck"
                    />
                </div>
            </div>

        </main>
    );
}
