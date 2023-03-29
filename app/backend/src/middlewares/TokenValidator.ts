import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import UsersModel from '../database/models/UsersModel';

const secret = process.env.JWT_SECRET || 'batatinha';

const tokenValidator = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Token not found' });
  }

  try {
    const { data } = jwt.verify(token, secret) as JwtPayload;
    const user = await UsersModel.findOne({ where: { email: data } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.body.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default tokenValidator;
