import { DB_CONNECTED } from './local/dbService';

export const getStatus = () => {
    return {
        dbConnected: DB_CONNECTED()
    };
};
