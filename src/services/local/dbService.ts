import mongoose, {Schema, Document} from 'mongoose';


const LOG_HEADER = 'DB Service';

export const DB_CONNECTED = () => DB_CONNECTED;

let dbConnected = false;

mongoose.connection.on('error', err => {
    console.log(err.stack, LOG_HEADER);
});
mongoose.connection.on('connected', ()=> {
    console.log('db ready', LOG_HEADER);
    dbConnected = true;
});
mongoose.connection.on('disconnected', ()=> {
    console.log('disconnected', LOG_HEADER);
    dbConnected = false;
});
mongoose.connection.on('reconnected', ()=>{
    console.log('reconnected', LOG_HEADER);
    dbConnected = true;
});

export const dbConnect = async () => {
    const LOG_METHOD='dbConnect';
    console.log(`${LOG_METHOD} db attempted`, LOG_HEADER);
    try {
        if (!process.env.MONGO_DB_URL) {
            throw new Error('MONGO_DB_URL environment variable is not defined');
        }
        await mongoose.connect(process.env.MONGO_DB_URL);
    }
    catch(err: any) {
        console.log(`${LOG_METHOD} ${err.stack}`, LOG_HEADER);
        setTimeout(()=>{
            (async()=>{await dbConnect();})();
        }, Number(process.env.DB_CONNECTION_RETRY_TIMEOUT));
    } 
};

(async()=>await dbConnect())();