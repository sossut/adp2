import { validationResult } from 'express-validator';
import {
  getAllStreets,
  getStreet,
  postStreet,
  putStreet,
  deleteStreet
} from '../models/streetModel';
import { Request, Response, NextFunction } from 'express';
import CustomError from '../../classes/CustomError';
import { PostStreet } from '../../interfaces/Street';
import { User } from '../../interfaces/User';

const streetListGet = async (
  req: Request,
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
    const streets = await getAllStreets();
    res.json(streets);
  } catch (error) {
    next(error);
  }
};

const streetGet = async (
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
    const id = req.params.id;
    const street = await getStreet(id);
    res.json(street);
  } catch (error) {
    next(error);
  }
};

const streetPost = async (
  req: Request<{}, {}, PostStreet>,
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

    const street = await postStreet(req.body);
    res.json(street);
  } catch (error) {
    next(error);
  }
};

const streetPut = async (
  req: Request<{ id: string }, {}, PostStreet>,
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
    if ((req.user as User).role !== 'admin') {
      throw new CustomError('Unauthorized', 401);
    }
    const id = parseInt(req.params.id);
    const street = await putStreet(req.body, id);
    res.json(street);
  } catch (error) {
    next(error);
  }
};

const streetDelete = async (
  req: Request<{ id: string }>,
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
    if ((req.user as User).role !== 'admin') {
      throw new CustomError('Unauthorized', 401);
    }
    const street = await deleteStreet(parseInt(req.params.id));
    res.json(street);
  } catch (error) {
    next(error);
  }
};

export { streetListGet, streetGet, streetPost, streetPut, streetDelete };
