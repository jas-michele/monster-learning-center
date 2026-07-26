import { connectDB } from "../database/db.js";

export async function getHomeData(userId: number) {
    const db = await connectDB();

    const user = await db.get(`
        SELECT * 
        FROM users
        WHERE id = ?
        `,
        [userId]
    );

    if (!user) {
        throw new Error("User not found.");
    }
    
    const settings = await db.get(
        `
        SELECT *
        FROM settings
        WHERE userId = ?
        `,
        [user.id]
    );

    const progress = await db.get(
        `
        SELECT *
        FROM progress
        WHERE userId = ?
        `,
        [user.id]
    );

    const stats = {
    totalActivities:
        progress.completedLessons +
        progress.completedStories +
        progress.completedRaces +
        progress.completedPuzzles,

    level: user.level,
    stars: user.stars,
};

    return {
        user,
        settings,
        progress,
        stats
        
    };
}