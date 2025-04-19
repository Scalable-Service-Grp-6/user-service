import { NextFunction, Request, Response } from 'express';
import { Request as JWTRequest } from 'express-jwt';


export const retrieveTokenFromHeaderOrQueryString = (req: Request):string => {
    if(
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
        return req.headers.authorization.split(' ')[1];
    }
    else if(req.query && req.query.token) {
        return `${req.query.token as string}`;
    }
    return '';
}

export const checkForSpecificRole = (req: JWTRequest, res: Response, next: NextFunction) => {
    (async () => {
        const {role} = req.query;
        return next()
    });
}
