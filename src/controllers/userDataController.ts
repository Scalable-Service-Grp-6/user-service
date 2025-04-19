import { Request, Response } from 'express';
import { UserDto } from '../dto/user';
import { addUserData } from '../services/userDataService';

const LOG_HEADER = 'userDataController.ts'


export const createPublicUser = async (req: Request, res: Response) => {
    const LOG_METHOD = 'createUser';
    console.log(`${LOG_METHOD} called`, LOG_HEADER);
    try {        
        const user: UserDto = req.body;
        if (!user.name || !user.email || !user.password) {
            throw new Error('Missing required fields');
        }
        else {
            const createdUser = await addUserData(user);
            res.status(201).json(createdUser);
        }
    } catch (error) {
        console.error(`${LOG_METHOD} error`, LOG_HEADER, error);
    }
}
