import { validationResult } from 'express-validator';
import {
  getCity,
  getAllCities,
  postCity,
  putCity,
  deleteCity
} from '../models/cityModel';
import { Request, Response, NextFunction } from 'express';
import CustomError from '../../classes/CustomError';
import { PostCity } from '../../interfaces/City';
import { User } from '../../interfaces/User';

const cityListGet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }
    const cities = await getAllCities();
    res.json(cities);
  } catch (error) {
    next(error);
  }
};

const cityGet = async (
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
    const city = await getCity(id);
    res.json(city);
  } catch (error) {
    next(error);
  }
};

const cityPost = async (
  req: Request<{}, {}, PostCity>,
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
    const city = await postCity(req.body);
    res.json(city);
  } catch (error) {
    next(error);
  }
};

const cityPut = async (
  req: Request<{ id: string }, {}, PostCity>,
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
    const city = await putCity(req.body, id);
    res.json(city);
  } catch (error) {
    next(error);
  }
};

const cityDelete = async (
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
    const id = parseInt(req.params.id);
    const result = await deleteCity(id);
    if (result) {
      res.json({
        message: 'city deleted'
      });
    }
  } catch (error) {
    next(error);
  }
};

export { cityListGet, cityGet, cityPost, cityPut, cityDelete };
