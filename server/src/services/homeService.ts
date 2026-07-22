import { connectDB } from "../database/db.js";

export async function getHomeData() {
    const db = await connectDB();

    const getUser = async (userId: number) => {
        return db.get(
            `
        SELECT *
        FROM users 
        WHERE id = ?
        `,
            [userId]);
    };

    let user = await db.get(`
        SELECT * 
        FROM users
        LIMIT 1
        `);

    
    if (!user) {

        const result = await db.run(
            `
            INSERT INTO users(firstName)
            VALUES(?)
            `,
            ["DERRICK"]
        );

        const userId = Number(result.lastID)

        await db.run(
            `
        INSERT INTO settings(userId)
        VALUES(?)
        `,
            [userId]
        );

        await db.run(
            `
        INSERT INTO progress(userId)
        VALUES(?)
        `,
            [userId]
        );

        user = await getUser(userId)
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