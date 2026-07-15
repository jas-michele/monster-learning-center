import  sqlite3  from "sqlite3";
import { open } from "sqlite";
import path from "node:path";
import fs from "fs/promises";

const databasePath= path.resolve(
    process.cwd(),
    "data",
    "monster-learning.db"
);


export async function connectDB() {
    const db = await open({
        filename: databasePath,
        driver: sqlite3.Database,
    });

const schema = await fs.readFile(
    path.resolve(process.cwd(), "src/database/schema.sql"),
    "utf8"
);

await db.exec(schema);

return db;

}