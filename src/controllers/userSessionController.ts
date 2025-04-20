import { Request, Response, NextFunction } from 'express';
import { UserSessionDto } from '../dto/userSessions';
import { createUserSession, validateUserSession, deleteUserSession } from '../services/userSessionService';
import { UserDto } from '../dto/user';
import { Request as JWTRequest } from 'express-jwt';

const LOG_HEADER = 'userSessionController.ts';

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const LOG_METHOD = 'loginUser';
    console.log(`${LOG_METHOD} called`, LOG_HEADER);
    try {
        const userData : UserDto = req.body;
        if (!userData.email || !userData.password) {
            console.log(`${LOG_METHOD} error`, LOG_HEADER, 'Missing required fields');
            res.status(400).json({ error: 'Missing required fields' });
        }
        else {
            const jwtToken = await createUserSession(userData);
            res.status(201).json({jwtToken});
        }
    }
    catch(err: any) {
        console.error(`${LOG_METHOD} error`, LOG_HEADER, err);
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
}

export const mustBeAuthorizedFor = (role: string) => {
    const LOG_METHOD = 'mustBeAuthorizedFor';
    return async (req: JWTRequest, res: Response, next: NextFunction) => {
        console.log(`${LOG_HEADER} -> ${LOG_METHOD} called`);
        const auth = req.auth as any; 
        if (!auth?.userId || !auth?.sessionId || !auth?.exp) {
          res.status(401).json({ message: 'Invalid token payload' });
        }
        try {
            if(await validateUserSession(req.auth.userId, req.auth.sessionId, role)) {
                next();
            }
            else {
                res.status(401).json({message: 'Unauthorized'});
            }
        } catch (error) {
            res.status(401).json({message: 'Unauthorized'});
        }
        
    }
}

export const logoutUser = async (req: Request, res: Response) => {
    const LOG_METHOD = 'logoutUser';
    console.log(`${LOG_HEADER} -> ${LOG_METHOD} called`);
    const auth = (req as any).auth as { sessionId?: string };
    const sessionId = auth?.sessionId;
    if (!sessionId) {
        res.status(400).json({ error: 'No sessionId in token' });
    }
    try {
        await deleteUserSession(sessionId);
        res.status(200).json({message: 'User logged out successfully'});
    }
    catch(err: any) {
        console.error(`${LOG_METHOD} error`, LOG_HEADER, err);
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
}

export const verifySessionAndUserRole = async (req: JWTRequest, res: Response, next: NextFunction) => {
    const LOG_METHOD = 'verifySessionAndUserRole';
    console.log(`${LOG_HEADER} -> ${LOG_METHOD} called`, LOG_HEADER);
    const auth = req.auth as any;
    const role: string = req.query.role as string;
    if (!auth?.userId || !auth?.sessionId) {
        res.status(401).json({ message: 'Invalid token payload' });
    }
    if (!role) {
        res.status(400).json({ message: 'Missing role' });
    }
    try {
        if(await validateUserSession(auth.userId, auth.sessionId, role)) {
            next();
        }
        else {
            res.status(401).json({message: 'Unauthorized'});
        }
    } catch (error) {
        res.status(401).json({message: 'Unauthorized'});
    }
}
