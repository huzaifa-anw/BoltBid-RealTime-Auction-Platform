import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse..js";
import { db } from "../db/db.js";
import { users } from "../db/schema.js";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

// SIGNUP
export const signupUser = asyncHandler(async (req, res) => {
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

    let dbResponse;

    try {
        dbResponse = await db.insert(users).values(user).returning();
    } catch (err) {
        if (err.code === "23505") {
            throw new ApiError("Email already exists", 409, "USER_EXISTS");
        }

        console.error("DB ERROR:", err.cause || err);
        throw new ApiError("Database unavailable", 503, "DB_DOWN");
    }

    const safeUser = {
        id: dbResponse[0].id,
        name: dbResponse[0].name,
        email: dbResponse[0].email
    };

    const response = new ApiResponse(true, 201, "User created successfully", {user: safeUser})

    return res.status(response.statusCode).json(response);
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

    const response = new ApiResponse(true, 200, 'login successful', {accessToken})

    return res.status(response.statusCode).json(response);
});