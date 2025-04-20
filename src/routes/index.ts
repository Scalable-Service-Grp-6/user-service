import { getServerId } from '../controllers/server.id';
import { Application, Request, Response, RequestHandler } from 'express';
import { Params, expressjwt } from 'express-jwt';
import { SIGN_IN_SECRET_KEY } from '../properties/jwt.json';
import { retrieveTokenFromHeaderOrQueryString } from '../controllers/sessions';
import {
    createPublicUser,
    // createAdminUser,
    getUserByEmail,
    // deleteUserById 
} from '../controllers/userDataController';
import { loginUser, logoutUser, checkForSpecificRole, mustBeAuthorizedFor } from '../controllers/userSessionController';
import { whoAmIFor } from '../controllers/interservices';

/**
 * Helper function to evaluate the token and throw error if the token has expired
 */
const validateJWT:Params = {
    secret: SIGN_IN_SECRET_KEY,
    algorithms: ['HS256'],
    getToken: retrieveTokenFromHeaderOrQueryString
};

/**
 * Helper function to load the token if available and evaluate the token if token has expired
 */
const loadJwt:Params = {
    secret: SIGN_IN_SECRET_KEY,
    algorithms: ['HS256'],
    getToken: retrieveTokenFromHeaderOrQueryString,
    credentialsRequired: true
};

export class Index {
    public routes(app: Application): void {
        app.get('/ping', (req: Request, res: Response) => {
            (
                async () => {
                    const serverId = await getServerId();
                    res.status(200).json(serverId);                    
                }
            )();
        });

        app.post('/users', createPublicUser as RequestHandler);
        // app.post('/admin', createAdminUser as RequestHandler);
        app.get('/users', getUserByEmail as RequestHandler);
        // app.delete('/users/:userId', deleteUserById as RequestHandler);

        
        app.post('/auth', loginUser as RequestHandler);
        app.delete('/auth', expressjwt(validateJWT) as RequestHandler, mustBeAuthorizedFor('user'), logoutUser);
    }
};

export class InterServiceIndex {
    public routes(app: Application): void {
        app.get(
            '/auth/verify',
            expressjwt(validateJWT) as RequestHandler,
            checkForSpecificRole,
            whoAmIFor
        );
    }
};
