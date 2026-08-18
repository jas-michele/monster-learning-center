import "./PracticeLap.css";
import { useEffect, useState } from "react";
import PracticeTrack from "../../components/PracticeTrack";
import type { TruckColor } from "../Mechanic/truckCustomization";

import completeTruck from "../../assets/mechanic/blackTruck.png";
import redCompleteTruck from "../../assets/mechanic/redTruck.png";
import blueCompleteTruck from "../../assets/mechanic/blueTruck.png";
import greenCompleteTruck from "../../assets/mechanic/greenTruck.png";
import purpleCompleteTruck from "../../assets/mechanic/purpleTruck.png";

import Countdown from "../../components/Countdown/Countdown";
import { stopEngineRev } from "../../utils/engineAudio";

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

        let index = 0;

        const timer = setInterval(() => {
            index++;

            if (index < values.length) {
                setCountdown(values[index]);
            } else {
                clearInterval(timer);

                setTimeout(() => {
                    setCountdown("");
                    setDriving(true);
                }, 1000);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!driving) return;

        const engineStopTimer = window.setTimeout(() => {
            stopEngineRev();
        }, 9000);

        return () => {
            window.clearTimeout(engineStopTimer);
            stopEngineRev();
        };
    }, [driving]);


    return (
        <main className="practice-lap">
            <PracticeTrack />

            <Countdown value={countdown} />

            <div className={`practice-truck-runner ${driving ? "practice-truck-runner--driving" : ""}`}>
                <img
                    className="practice-truck"
                    src={completeTruckAssets[bodyColor]}
                    alt="Monster Truck"
                />
            </div>


        </main>
    );
}
