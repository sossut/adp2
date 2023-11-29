import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import CustomError from '../../classes/CustomError';
import { getAllResultSummaries } from '../models/resultSummaryModel';
import { User } from '../../interfaces/User';

const resultSummaryListGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getAllResultSummaries();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const resultSummaryGet = async (
  req: Request<{ id: number }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getAllResultSummaries();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const resultSummaryPost = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    throw new CustomError(messages, 400);
  }
  try {
    if ((req.user as User).role !== 'admin') {
      throw new CustomError('Unauthorized', 401);
    }
    const result = await getAllResultSummaries();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const resultSummaryPut = async (
  req: Request<{ id: number }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    throw new CustomError(messages, 400);
  }
  try {
    if ((req.user as User).role !== 'admin') {
      throw new CustomError('Unauthorized', 401);
    }
    const result = await getAllResultSummaries();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const resultSummaryDelete = async (
  req: Request<{ id: number }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    throw new CustomError(messages, 400);
  }
  try {
    if ((req.user as User).role !== 'admin') {
      throw new CustomError('Unauthorized', 401);
    }
    const result = await getAllResultSummaries();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export {
  resultSummaryListGet,
  resultSummaryGet,
  resultSummaryPost,
  resultSummaryPut,
  resultSummaryDelete
};
