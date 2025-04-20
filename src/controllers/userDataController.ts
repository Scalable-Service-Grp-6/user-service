import { Request, Response, RequestHandler } from 'express';
import { UserDto } from '../dto/user';
import { getUserDataByEmail, addUserData, deleteUserData } from '../services/userDataService';
import { Request as JWTRequest } from 'express-jwt';
const LOG_HEADER = 'userDataController.ts'

export const createUser = (role: 'user' | 'admin'): RequestHandler =>
    async (req: Request, res: Response): Promise<void> => {
    const LOG_METHOD = 'createUser';
    console.log(`${LOG_METHOD} called`, LOG_HEADER);
    try {        
        const user: UserDto = req.body;
        if (!user.name || !user.email || !user.password) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        const createdUser = await addUserData( {...user, role: role} as UserDto );
        res.status(201).json(createdUser);
        return;
    } catch (error: any) {
        console.log(`${LOG_METHOD} error`, LOG_HEADER, error);
        res.status(500).json({ error: error.message || 'Internal server error' });
        return;
    }
}

export const getUserByEmail = async (req: Request, res: Response): Promise<void> => {
    const LOG_METHOD = 'getUserByEmail';
    console.log(`${LOG_METHOD} called`, LOG_HEADER);
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ error: 'Email is required' });
            return;
        }
        const userData = await getUserDataByEmail(email as string);
        res.status(200).json(userData);
    } catch (error: any) {
        console.log(`${LOG_METHOD} error`, LOG_HEADER, error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
}

export const deleteUser = async (req: JWTRequest, res: Response): Promise<void> => {
    const LOG_METHOD = 'deleteUser';
    console.log(`${LOG_METHOD} called`, LOG_HEADER);
    try {
        const auth = req.auth as any;
        if (!auth?.userId || !auth?.sessionId) {
            res.status(401).json({ message: 'Invalid token payload' });
        }
        try {
            const deletedUser = await deleteUserData(auth.userId);
            res.status(200).json(deletedUser);
        } catch (error: any) {
            console.log(`${LOG_METHOD} error`, LOG_HEADER, error);
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    } catch (error: any) {
        console.log(`${LOG_METHOD} error`, LOG_HEADER, error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
}

