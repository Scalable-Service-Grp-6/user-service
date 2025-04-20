import { Request, Response } from 'express';
import { UserDto } from '../dto/user';
import { getUserDataByEmail, addUserData } from '../services/userDataService';

const LOG_HEADER = 'userDataController.ts'

export const createPublicUser = async (req: Request, res: Response): Promise<void> => {
    const LOG_METHOD = 'createUser';
    console.log(`${LOG_METHOD} called`, LOG_HEADER);
    try {        
        const user: UserDto = req.body;
        if (!user.name || !user.email || !user.password) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        const createdUser = await addUserData(user);
        res.status(201).json(createdUser);
    } catch (error: any) {
        console.log(`${LOG_METHOD} error`, LOG_HEADER, error);
        res.status(500).json({ error: error.message || 'Internal server error' });
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
