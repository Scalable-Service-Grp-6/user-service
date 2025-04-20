import { NextFunction, Request, Response } from 'express';

const LOG_HEADER = 'sessions.ts';

export const retrieveTokenFromHeaderOrQueryString = (req: Request):string => {
    const LOG_METHOD = 'retrieveTokenFromHeaderOrQueryString';
    console.log(`${LOG_HEADER} -> ${LOG_METHOD} called`, LOG_HEADER);
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

