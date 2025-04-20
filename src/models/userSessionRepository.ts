import { UserDto } from "../dto/user";
import { UserSessionDto } from "../dto/userSessions";
import { raiseErrorWhenDisconnected, UserSessionModel } from "../services/local/dbService";
import  { v4 as uuidv4 } from 'uuid';

const LOG_HEADER = 'userSessionRepository.ts';

export const addUserSession = async (userSessionData: UserSessionDto) => {
    const LOG_METHOD = 'addUserSession';
    await raiseErrorWhenDisconnected();
    try {
        const sessionId = uuidv4();
        /*
         * One session per user. If the user already has a session, update the session.
         * If the user does not have a session, create a new session.
        **/
        const userSession = await UserSessionModel.findOneAndUpdate(
            { userId: userSessionData.userId },
            {
              $set: {
                sessionId: sessionId,
                createdAt: new Date(),
                expiresAt: userSessionData.expiresAt
              }
            },
            {
              upsert: true,
              new: true,
              setDefaultsOnInsert: true
            }
          ).exec();
        return userSession;
    }
    catch(err: any) {
        throw new Error(`${LOG_HEADER} -> ${LOG_METHOD} -> Failed to add user session: ${err}`);
    }
}

export const getUserSessionDataPopulated = async (userId: string, sessionId: string) => {
    const LOG_METHOD = 'getUserSessionDataPopulated';
    await raiseErrorWhenDisconnected();
    try {
        const userSessionData: UserSessionDto | null = await UserSessionModel
          .findOne({userId, sessionId})
          .populate({
            path: 'userId',
            select: 'name email role'
          })
          .exec();
        if (!userSessionData) {
            throw new Error(`${LOG_HEADER} -> ${LOG_METHOD} -> User session not found`);
        }
        return userSessionData;
    }
    catch(err: any) {
        console.error(`${LOG_METHOD} error`, LOG_HEADER, err);
        throw new Error(`${LOG_HEADER} -> ${LOG_METHOD} -> Failed to get user session data: ${err}`);
    }
}

export const deleteUserSessionBySessionId = async (sessionId: string) => {
    const LOG_METHOD = 'deleteUserSessionBySessionId';
    await raiseErrorWhenDisconnected();
    try {
        await UserSessionModel.deleteOne({ sessionId });
    } 
    catch(err: any) {
        throw new Error(`${LOG_HEADER} -> ${LOG_METHOD} -> Failed to delete user session: ${err}`);
    }
} 



