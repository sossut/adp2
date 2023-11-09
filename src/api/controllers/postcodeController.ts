import { validationResult } from 'express-validator';
import {
  getPostcode,
  getAllPostcodes,
  postPostcode,
  putPostcode,
  deletePostcode
} from '../models/postcodeModel';
import { Request, Response, NextFunction } from 'express';
import CustomError from '../../classes/CustomError';
import { PostPostcode } from '../../interfaces/Postcode';
import { User } from '../../interfaces/User';

const postcodeListGet = async (
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
    const postcodes = await getAllPostcodes();
    res.json(postcodes);
  } catch (error) {
    next(error);
  }
};

const postcodeGet = async (
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
    const postcode = await getPostcode(id);
    res.json(postcode);
  } catch (error) {
    next(error);
  }
};

const postcodePost = async (
  req: Request<{}, {}, PostPostcode>,
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

    const postcode = await postPostcode(req.body);
    res.json(postcode);
  } catch (error) {
    next(error);
  }
};

const postcodePut = async (
  req: Request<{ id: string }, {}, PostPostcode>,
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
    const postcode = await putPostcode(req.body, id);
    res.json(postcode);
  } catch (error) {
    next(error);
  }
};

const postcodeDelete = async (
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
    const postcode = await deletePostcode(parseInt(req.params.id));
    res.json(postcode);
  } catch (error) {
    next(error);
  }
};

export {
  postcodeListGet,
  postcodeGet,
  postcodePost,
  postcodePut,
  postcodeDelete
};
