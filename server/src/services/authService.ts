import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connectDB } from "../database/db.js";
import { createDefaultAchievements } from "./achievementService.js";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}

export async function registerUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string
) {
    const db = await connectDB();

    const normalizedEmail = email.trim().toLowerCase();

    const exisingUser = await db.get(
        `
        SELECT id
        FROM users
        WHERE email = ?
        `,
        [normalizedEmail]
    );

    if (exisingUser) {
        throw new Error("An account with this email already exists.")
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.run(
        `
        INSERT INTO users(firstName, lastName, email, password)
        VALUES(?, ?, ?, ?)
        `,
        [
            firstName.trim(),
            lastName.trim(),
            normalizedEmail,
            hashedPassword
        ]
    );

    const userId = result.lastID;

    if (userId === undefined) {
        throw new Error("Failed to create user.")
    }

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

 await createDefaultAchievements(userId);

    const user = await db.get(
        `
        SELECT id, firstName, lastName, email, level, stars, createdAt, updatedAt
        FROM users
        WHERE id = ?
        `,
        [userId]
    );

   
    const token = jwt.sign(
        {
            id: user.id,
            email: user.email
        },
        JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

    return {
        user,
        token
    };
}

export async function loginUser(email: string, password: string) {
    const db = await connectDB();

    const normalizedEmail = email.trim().toLowerCase();

    const user = await db.get(
        `
        SELECT *
        FROM users
        WHERE email = ?
        `,
        [normalizedEmail]
    );

    if (!user) {
        throw new Error("Invalid email or password.")
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email
        },
        JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

    const {
        password: _password,
        ...safeUser
    } = user;

    return {
        user: safeUser,
        token
    };
}

export const getCurrentUser = async (userId: number) => {
    const db =  await connectDB();
    const user = await db.get(
        `
        SELECT
            id,
            firstName,
            lastName,
            email,
            level,
            FROM users
            WHERE id = ?
        `,
        [userId]
    );

    return user;
}