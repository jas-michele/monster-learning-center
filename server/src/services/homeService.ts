import { connectDB } from "../database/db.js";

export async function getHomeData() {
    const db = await connectDB();

    let user = await db.get("SELECT * FROM users LIMIT 1");

    if (!user) {
        await db.run(
            `
            INSERT INTO users(firstName)
            VALUES(?)
            `,
            ["DERRICK"]
        );

        user = await db.get("SELECT * FROM users LIMIT 1");
    }

    return user;
}