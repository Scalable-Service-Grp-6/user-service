import { ObjectId } from "mongodb";
import { UserDto } from "./user";

export interface UserSessionDto {
    userId: UserDto | ObjectId;
    jwtToken: string;
    createdAt: Date;
    expiresAt: Date;
}
