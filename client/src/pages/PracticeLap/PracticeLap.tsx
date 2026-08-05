import "./PracticeLap.css";
import { useEffect, useState } from "react";
import PracticeTrack from "../../components/PracticeTrack";
import PracticeTruck from "../../components/PracticeTruck";

import completeTruck from "../../assets/blackTruck.png";
import redCompleteTruck from "../../assets/redTruck.png";
import blueCompleteTruck from "../../assets/blueTruck.png";
import greenCompleteTruck from "../../assets/greenTruck.png";
import purpleCompleteTruck from "../../assets/purpleTruck.png";

import Countdown from "../../components/Countdown/Countdown";

export default function PracticeLap() {

    const savedTruck = localStorage.getItem("monsterTruckCustomization");
    const [countdown, setCountdown] = useState("3");
    const [driving, setDriving] = useState(false);

    const truckData = savedTruck
        ? JSON.parse(savedTruck)
        : null;

    const bodyColor = truckData?.customization?.bodyColor ?? "black";

    const completeTruckAssets = {
        black: completeTruck,
        red: redCompleteTruck,
        blue: blueCompleteTruck,
        green: greenCompleteTruck,
        purple: purpleCompleteTruck,
        orange: redCompleteTruck,
    };

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


    return (
        <main className="practice-lap">
            <PracticeTrack />

            <Countdown value={countdown} />

            <img
                className={`practice-truck ${driving ? "practice-truck--driving" : ""
                    }`}
                src={completeTruckAssets[bodyColor]}
                alt="Monster Truck"
            />


        </main>
    );
}