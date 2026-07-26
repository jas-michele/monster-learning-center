import { useEffect, useState } from "react";
import "./Achievements.css";
import { getAchievements } from "../../services/achievementService";

type Achievement = {
    id: number;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    unlockedAt: string | null;
};

export default function Achievements() {
    const [achievements, setAchievements] = useState<Achievement[]>([]);

    useEffect(() => {
        async function loadAchievements() {
            try {
                const data = await getAchievements();

                console.log(data);
                setAchievements(data);
            } catch (error) {
                console.error(error);
            }
        }

        loadAchievements();
    }, []);

    return (
        <main className="achievements">
            <h1>🏆 Trophy Room</h1>

            <div className="achievement-grid">
                {achievements.map((achievement) => (
                    <article
                        key={achievement.id}
                        className={`achievement-card ${
                            achievement.unlocked
                                ? "achievement-card--unlocked"
                                : "achievement-card--locked"
                        }`}
                    >
                        <div className="achievement-icon">
                            {achievement.icon}
                        </div>

                        <h2>{achievement.title}</h2>

                        <p>{achievement.description}</p>

                        <span>
                            {achievement.unlocked
                                ? "Unlocked"
                                : "Locked"}
                        </span>
                    </article>
                ))}
            </div>
        </main>
    );
}