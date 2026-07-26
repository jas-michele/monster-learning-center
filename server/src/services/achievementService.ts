
import { connectDB } from "../database/db.js";

export async function createDefaultAchievements(userId: number) {
    const db = await connectDB();

    const achievements = [
        {
            title: "First Login",
            description: "Welcome to Derrick's Playhouse",
            icon: "🎉"
        },
        {
            title: "Story Explorer",
            description: "Complete your first story.",
            icon: "📖",     
         },
         {
            title: "Master Mechanic",
            description: "Build your first monster truck.",
            icon: "🔧",
         },
         {
            title: "Race Champion",
            description: "Finish your first race.",
            icon: "🏁",
         },
         {
            title: "Dino Hunter",
            description: "Discover your first dinosaur",
            icon: "🦖",
         },
         {
            title: "Star Collector",
            description: "Earn your first 100 stars.",
            icon: "⭐️"
         },

    ]; 

    for (const achievement of achievements) {
        await db.run(
            `
            INSERT INTO achievements (
                userId,
                title,
                description,
                icon
            )
                VALUES (?, ?, ?, ?)
            `,
            [
                userId,
                achievement.title,
                achievement.description,
                achievement.icon,
            ]
        )
    }
}









export async function getAchievements(userId: number) {
    const db = await connectDB();

    const achievements = await db.all(
        `
        SELECT 
            id,
            title,
            description,
            icon,
            unlocked,
            unlockedAt
        FROM achievements
        WHERE userId = ?
        ORDER BY id ASC    
        `,
        [userId]
    );

    return achievements.map((achievement) => ({
        ...achievement,
        unlocked: Boolean(achievement.unlocked),
    }));
}