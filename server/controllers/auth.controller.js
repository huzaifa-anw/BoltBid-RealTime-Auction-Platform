import asyncHandler from "express-async-handler"
import ApiError from "../utils/ApiError.js";
import { db } from '../db/db.js'
import { users } from "../db/schema.js";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export const registerUser = asyncHandler(async (req, res) => {
    // register user

    // validate request body
    const {name, email, password} = req.body;
    if (!name || !email || !password) throw new ApiError('All fields are required', 400, 'VALIDATION_ERROR');

    // check for existing user with the same email
    const result = await db.select().from(users).where(eq(users.email, email));
    const existingUser = result[0];
    if(existingUser) throw new ApiError('Email is already taken', 409, 'USER_EXISTS');

    // hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    //santize email
    const sanitizedEmail = email.toLowerCase().trim();
    
    //save to db
    const user = {
        name,
        email: sanitizedEmail,
        password_hash: passwordHash
    }

    const response = await db.insert(users).values(user).returning();

    console.dir(response);

    const safeUser = {
        id: response[0].id,
        name: response[0].name,
        email: response[0].email
    }

    return res.status(200).json({
        sucess: true,
        status: 200,
        msg: 'User created successfully',
        user: safeUser
    });
})

export const loginUser = asyncHandler(async (req, res) => {
    // login user
})