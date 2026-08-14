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
import lapAssets from "../../assets/practiceLap/lapassets.png";
import raceAvatar from "../../assets/avatars/race.png";
import {
    playCrowdCheer,
    playPuddleSplash,
    scheduleEngineRevStop,
    startEngineRev,
    stopEngineRev,
} from "../../utils/engineAudio";

import Countdown from "../../components/Countdown/Countdown";

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
        startEngineRev();

        let index = 0;

        const timer = setInterval(() => {
            index++;

            if (index < values.length) {
                setCountdown(values[index]);
            } else {
                clearInterval(timer);
                stopEngineRev();

                setTimeout(() => {
                    setCountdown("");
                    setDriving(true);
                }, 1000);
            }
        }, 1000);

        return () => {
            clearInterval(timer);
            scheduleEngineRevStop();
        };
    }, []);

    useEffect(() => {
        if (!driving) return undefined;

        const splashTimer = window.setTimeout(() => {
            playPuddleSplash();
        }, 7560);
        const cheerTimer = window.setTimeout(() => {
            playCrowdCheer();
        }, 8100);

        return () => {
            window.clearTimeout(splashTimer);
            window.clearTimeout(cheerTimer);
        };
    }, [driving]);


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
