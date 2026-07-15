import { connectDB } from "../database/db.js";

export async function getHomeData() {
    const db = await connectDB();

    let user = await db.get(`
        SELECT *
        FROM users LIMIT 1`);

    if (!user) {
       
        const result = await db.run(
            `
            INSERT INTO users(firstName)
            VALUES(?)
            `,
            ["DERRICK"]
        );

       const userId = result.lastID;

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

       user = await db.get(`
        SELECT * 
        FROM users
        WHERE id = ?
        `, 
        [userId]
       );

    }

    return user;
}