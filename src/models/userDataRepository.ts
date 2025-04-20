import { UserDto } from '../dto/user';
import { raiseErrorWhenDisconnected, UserModel, UserSessionModel } from '../services/local/dbService';

const LOG_HEADER = 'userDataRepository.ts';

export const createUserRecord = async (user: UserDto) => {
    const LOG_METHOD = 'createUserRecord';
    await raiseErrorWhenDisconnected();
    try {
        const { name, email, password, role } = user;
        const createdUser = await UserModel.create({ name, email, password, role });
        return {
            _id: createdUser.toObject()._id,
            name: createdUser.toObject().name,
            email: createdUser.toObject().email,
            role: createdUser.toObject().role
        };
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

export const deleteUserSession = async (userId: string) => {
    const LOG_METHOD = 'deleteUserSession';
    await raiseErrorWhenDisconnected();
    try {
        return await UserSessionModel.findOneAndDelete({userId: userId});
    }
    catch(err: any) {
        throw new Error(`${LOG_HEADER} -> ${LOG_METHOD} -> Failed to delete user session: ${err}`);
    }
}   

export const deleteUserRecord = async (userId: string) => {
    const LOG_METHOD = 'deleteUserRecord';
    await raiseErrorWhenDisconnected();
    try {
        return await UserModel.findOneAndDelete({_id: userId});
    }
    catch(err: any) {
        throw new Error(`${LOG_HEADER} -> ${LOG_METHOD} -> Failed to delete user record: ${err}`);
    }
}
