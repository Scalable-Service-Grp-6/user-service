import serverProperties from '../properties/server.id.json';
import { getStatus } from '../services/statusService';

const startDateTimeStamp = new Date().toISOString();

export const getServerId = async () => {
    return{
        ...serverProperties,
        startDateTimeStamp,
        ...getStatus()
    };
};
