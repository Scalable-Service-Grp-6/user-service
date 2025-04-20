import bcrypt from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { UserDto } from "../dto/user";
import { UserSessionDto } from "../dto/userSessions";
import { getUserDataForPasswordValidation,  } from "../models/userDataRepository";
import { SIGN_IN_SECRET_KEY } from '../properties/jwt.json';
import { addUserSession, getUserSessionDataPopulated, deleteUserSessionBySessionId} from "../models/userSessionRepository";

const LOG_HEADER = 'userSessionService.ts';
const SIGN_TOKEN_EXPIRY = 60*60*24;

export const validateUserSession = async (userId: string, sessionId: string, role: string) => {
    const LOG_METHOD = 'validateUserSession';
    console.log(`${LOG_HEADER} -> ${LOG_METHOD} called`);
    try {
        const userSessionData = await getUserSessionDataPopulated(userId, sessionId);
        const userData = userSessionData.userId as UserDto;
        if( userData.role !== role ) {
            throw new Error('Unauthorized');
        }
        return true;
    }
    catch(err: any) {
        console.error(`${LOG_HEADER} -> ${LOG_METHOD} error`, LOG_HEADER, err);
        throw new Error(`${LOG_HEADER} -> ${LOG_METHOD} -> Failed to validate user session: ${err}`);
    }
}

export const createUserSession = async (userData: UserDto) => {
    const LOG_METHOD = 'createUserSession';
    console.log(`${LOG_HEADER} -> ${LOG_METHOD} called`);
    try {
        const userDataForPasswordValidation: UserDto = await getUserDataForPasswordValidation(userData.email);
        if (!userDataForPasswordValidation) {
            console.log(`${LOG_HEADER} -> ${LOG_METHOD} error`, 'User not found');
            throw new Error('User not found');
        }
        const isPasswordValid = await bcrypt.compare(userData.password, userDataForPasswordValidation.password);
        if (!isPasswordValid) {
            console.log(`${LOG_HEADER} -> ${LOG_METHOD} error`, 'Invalid password');
            throw new Error('Invalid password');
        }        
        const userSessionData: UserSessionDto = {
            userId: userDataForPasswordValidation._id,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + SIGN_TOKEN_EXPIRY * 1000),
        }
        const userSession = await addUserSession(userSessionData);
        try {
            const jwtToken = sign(
                { userId: userSession.userId, sessionId: userSession.sessionId },
                SIGN_IN_SECRET_KEY,
                { expiresIn: SIGN_TOKEN_EXPIRY });
            return jwtToken;
        } catch (error) {
            console.log(`${LOG_HEADER} -> ${LOG_METHOD} error`, error);
            throw new Error('Failed to create user session');
        }
    }   
    catch(err: any) {
        console.error(`${LOG_HEADER} -> ${LOG_METHOD} error`, err);
        throw new Error(`${LOG_HEADER} -> ${LOG_METHOD} -> Failed to create user session: ${err}`);
    }
}

export const deleteUserSession = async (sessionId: string) => {
    const LOG_METHOD = 'deleteUserSession';
    console.log(`${LOG_HEADER} -> ${LOG_METHOD} called`, LOG_HEADER);
    try {
        await deleteUserSessionBySessionId(sessionId);
    }
    catch(err: any) {
        console.error(`${LOG_HEADER} -> ${LOG_METHOD} error`, err);
        throw new Error(`${LOG_HEADER} -> ${LOG_METHOD} -> Failed to delete user session: ${err}`);
    }
}


