import validator from 'validator';
import bcrypt from 'bcrypt';

export const validateEmail = (email: string): boolean => {
    return validator.isEmail(email);
};

export const validatePassword = (password: string): boolean => {
    // Password must be at least 8 characters long
    // Must contain at least one letter, one number, and one special character
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
};

export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};