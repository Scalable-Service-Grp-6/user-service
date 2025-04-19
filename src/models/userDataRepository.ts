import { UserDto } from '../dto/user';
import { raiseErrorWhenDisconnected, UserModel } from '../services/local/dbService';

export const createUserRecord = async (user: UserDto) => {
    await raiseErrorWhenDisconnected();
    try {
        const { name, email, password } = user;
        return await UserModel.create({ name, email, password });
    } catch (error) {
        throw new Error('Failed to create user record');
    }
}
