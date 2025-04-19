import { Request as JWTRequest, Response } from 'express';

export const whoAmIFor = (req: JWTRequest, res: Response) => {
    res.status(200).send(req['user']);
};
