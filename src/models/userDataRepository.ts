import { UserDto } from '../dto/user';
import { raiseErrorWhenDisconnected, UserModel } from '../services/local/dbService';

const LOG_HEADER = 'userDataRepository.ts';

export const createUserRecord = async (user: UserDto) => {
    const LOG_METHOD = 'createUserRecord';
    await raiseErrorWhenDisconnected();
    try {
        const { name, email, password } = user;
        return await UserModel.create({ name, email, password });
    } catch (error) {
        throw new Error(`${LOG_HEADER} -> ${LOG_METHOD} -> Failed to create user record: ${error}`);
    }
}

export const getUserData = async (email: string) => {
    const LOG_METHOD = 'getUserData';
    await raiseErrorWhenDisconnected();
    try {
        return await UserModel.findOne(
            { email:email },
            { __v: 0, password: 0 }
        );
    }
    catch(err: any) {
        throw new Error(`${LOG_HEADER} -> ${LOG_METHOD} -> Failed to get user data: ${err}`);
    }
}

export const getUserDataForPasswordValidation = async (email: string) => {
    const LOG_METHOD = 'getUserData';
    await raiseErrorWhenDisconnected();
    try {
        return await UserModel.findOne(
            { email:email }
        );
    }
    catch(err: any) {
        throw new Error(`${LOG_HEADER} -> ${LOG_METHOD} -> Failed to get user data: ${err}`);
    }
}
