import mongoose from "mongoose";
import { UserDto } from "./user";

export interface UserSessionDto {
    _id?: mongoose.ObjectId;
    userId: UserDto | mongoose.ObjectId;
    createdAt: Date;
    expiresAt: Date;
    sessionId?: string;
}
