import { validationResult } from 'express-validator';
import {
  postUser,
  deleteUser,
  putUser,
  getAllUsers,
  getUser
} from '../models/userModel';
import { Request, Response, NextFunction } from 'express';

import bcrypt from 'bcryptjs';
import { User, PostUser } from '../../interfaces/User';
import CustomError from '../../classes/CustomError';

const salt = bcrypt.genSaltSync(12);

const userListGet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const userGet = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }
    const user = await getUser(req.params.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const userPost = async (
  req: Request<{}, {}, PostUser>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }
    const { password } = req.body;
    req.body.password = bcrypt.hashSync(password, salt);

    const result = await postUser(req.body);
    if (result) {
      res.json({
        message: 'user added',
        user_id: result
      });
    } else {
      throw new CustomError('no user inserted', 400);
    }
  } catch (error) {
    next(error);
  }
};

const userPut = async (
  req: Request<{ id: number }, {}, User>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }
    if ((req.user as User).role !== 'admin') {
      throw new CustomError('Unauthorized', 403);
    }

    const user = req.body;
    const result = await putUser(user, req.params.id);
    if (result) {
      res.json({
        message: 'user updated'
      });
    }
  } catch (error) {
    next(error);
  }
};

const userPutCurrent = async (
  req: Request<{ id: number }, {}, User>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }
    const user = req.body;

    const result = await putUser(user, (req.user as User).id);
    if (result) {
      res.json({
        message: 'user updated'
      });
    }
  } catch (error) {
    next(error);
  }
};

const userDelete = async (
  req: Request<{ id: number }, {}, { user: User }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }
    if ((req.user as User).role === 'admin') {
      const result = await deleteUser(req.params.id);
      if (result) {
        res.json({
          message: 'user deleted'
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

const userDeleteCurrent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await deleteUser((req.user as User).id);
    if (result) {
      res.json({
        message: 'user deleted'
      });
    }
  } catch (error) {
    next(error);
  }
};

const checkToken = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    next(new CustomError('token not valid', 403));
  } else {
    res.json(req.user);
  }
};

export {
  userListGet,
  userGet,
  userPost,
  userPut,
  userPutCurrent,
  userDelete,
  userDeleteCurrent,
  checkToken
};
