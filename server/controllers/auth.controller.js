import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";
import { db } from "../db/db.js";
import { users } from "../db/schema.js";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

// REGISTER
export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new ApiError("All fields are required", 400, "VALIDATION_ERROR");
    }

    const sanitizedEmail = email.toLowerCase().trim();

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = {
        name,
        email: sanitizedEmail,
        password_hash: passwordHash
    };

    let response;

    try {
        response = await db.insert(users).values(user).returning();
    } catch (err) {
        if (err.code === "23505") {
            throw new ApiError("Email already exists", 409, "USER_EXISTS");
        }

        console.error("DB ERROR:", err.cause || err);
        throw new ApiError("Database unavailable", 503, "DB_DOWN");
    }

    const safeUser = {
        id: response[0].id,
        name: response[0].name,
        email: response[0].email
    };

    return res.status(201).json({
        success: true,
        statusCode: 201,
        msg: "User created successfully",
        user: safeUser
    });
});


// LOGIN
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError("All fields are required", 400, "VALIDATION_ERROR");
    }

    const sanitizedEmail = email.toLowerCase().trim();

    let emailMatch;

    try {
        emailMatch = await db
            .select()
            .from(users)
            .where(eq(users.email, sanitizedEmail));
    } catch (err) {
        console.error("DB ERROR:", err.cause || err);
        throw new ApiError("Database unavailable", 503, "DB_DOWN");
    }

    const existingUser = emailMatch[0];

    if (!existingUser) {
        throw new ApiError("User does not exist", 404, "USER_DOESNT_EXIST");
    }

    const checkPassword = await bcrypt.compare(
        password,
        existingUser.password_hash
    );

    if (!checkPassword) {
        throw new ApiError("Incorrect password", 401, "INCORRECT_PASSWORD");
    }

    const payload = {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email
    };

    const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "24h" }
    );

    return res.status(200).json({
        success: true,
        statusCode: 200,
        msg: "Login Successful",
        accessToken
    });
});