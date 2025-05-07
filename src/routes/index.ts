import { getServerId } from '../controllers/server.id';
import { Application, Request, Response, RequestHandler, NextFunction } from 'express';
import { Params, expressjwt, Request as JWTRequest } from 'express-jwt';
import { SIGN_IN_SECRET_KEY } from '../properties/jwt.json';
import { retrieveTokenFromHeaderOrQueryString } from '../controllers/sessions';
import {
    createUser,
    getUserByEmail,
    deleteUser
} from '../controllers/userDataController';
import { loginUser, logoutUser, verifySessionAndUserRole, mustBeAuthorizedFor } from '../controllers/userSessionController';
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
        app.get('/users/ping', (req: Request, res: Response) => {
            (
                async () => {
                    const serverId = await getServerId();
                    res.status(200).json(serverId);                    
                }
            )();
        });
        app.post('/users/users', createUser('user') as RequestHandler);
        app.post('/users/admin', mustBeAuthorizedFor('admin'), createUser('admin') as RequestHandler);

        app.get('/users/users', getUserByEmail as RequestHandler);

        app.delete('/users/users', expressjwt(validateJWT) as RequestHandler, deleteUser as RequestHandler);

        app.post('/users/auth', loginUser as RequestHandler);
        app.delete('/users/auth', expressjwt(validateJWT) as RequestHandler, mustBeAuthorizedFor('user'), logoutUser);

        app.get(
            '/users/verify/user',
            expressjwt(validateJWT) as RequestHandler,
            (req: Request, res: Response, next: NextFunction) => verifySessionAndUserRole(req as JWTRequest, res, next),
            whoAmIFor
        );
    }
};

// export class InterServiceIndex {
//     public routes(app: Application): void {
//         app.get(
//             '/users/verify/user',
//             expressjwt(validateJWT) as RequestHandler,
//             (req: Request, res: Response, next: NextFunction) => verifySessionAndUserRole(req as JWTRequest, res, next),
//             whoAmIFor
//         );
//     }
// };
