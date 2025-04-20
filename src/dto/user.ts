import mongoose from "mongoose";

export interface UserDto {
    _id?: mongoose.ObjectId;
    name: string,
    email: string,
    password: string,        // bcrypt/scrypt/argon2 hash
    role: string,
    createdAt: Date,
    updatedAt: Date
}
