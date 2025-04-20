import mongoose, {Schema, Document} from 'mongoose';
import { UserDto } from '../../dto/user';
import { UserSessionDto } from '../../dto/userSessions';


const LOG_HEADER = 'DB Service';

export const DB_CONNECTED = () => dbConnected;

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
    console.log(`${LOG_METHOD} attempted`, LOG_HEADER);
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

export const raiseErrorWhenDisconnected = async() => {
    if (DB_CONNECTED() === false) {
        throw new Error('Database connection failed');
    }
}

const userSchema = new Schema<UserDto>({
    name: {type: String, required: true},
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: {type: String, required: true},
    role: {type: String, required: true}
}, {timestamps: true});


const userSessionSchema = new Schema<UserSessionDto>({
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    sessionId: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    expiresAt: {type: Schema.Types.Date}
});
userSessionSchema.index({ userId: 1, sessionId: 1 }, { unique: true,  name: 'one_session_per_user'});
userSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 24 * 60 * 60 });



export const UserModel = mongoose.model<UserDto>('User', userSchema);
export const UserSessionModel = mongoose.model<UserSessionDto>('UserSession', userSessionSchema);
