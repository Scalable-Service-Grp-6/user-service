import { UserDto } from '../dto/user';
import { createUserRecord } from '../models/userDataRepository';
import { validateEmail, validatePassword, hashPassword } from '../utils/validation';

export const addUserData = async (user: UserDto) => {
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
};