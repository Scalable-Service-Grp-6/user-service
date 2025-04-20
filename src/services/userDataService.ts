import { UserDto } from '../dto/user';
import { createUserRecord, getUserData } from '../models/userDataRepository';
import { validateEmail, validatePassword, hashPassword } from '../utils/validation';

const LOG_HEADER = 'userDataService.ts';

export const addUserData = async (user: UserDto) => {
    const LOG_METHOD = 'addUserData';
    try {
        // Validate email
        if (!validateEmail(user.email)) {
            throw new Error('Invalid email format');
    }

    // Validate password
    if (!validatePassword(user.password)) {
        throw new Error('Password must be at least 8 characters long and contain at least one letter, one number, and one special character');
    }

    // Hash the password
    const hashedPassword = await hashPassword(user.password);
    
    // Create user with hashed password
    const userWithHashedPassword = {
        ...user,
        password: hashedPassword
    };

        const createdUser = await createUserRecord(userWithHashedPassword);
        return createdUser;
    }
    catch(err: any) {
        console.error(`${LOG_METHOD} error`, LOG_HEADER, err);
    }
};

export const getUserDataByEmail = async (email: string) => {
    const LOG_METHOD = 'getUserByEmail';
    try {
        if(!validateEmail(email)) {
            throw new Error('Invalid email format');
        }

        const user = await getUserData(email);
        return user;
    }
    catch(err: any) {
        console.error(`${LOG_METHOD} error`, LOG_HEADER, err);
    }
}