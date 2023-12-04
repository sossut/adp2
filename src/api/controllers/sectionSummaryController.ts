import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import CustomError from '../../classes/CustomError';
import {
  PostSectionSummary,
  PutSectionSummary
} from '../../interfaces/SectionSummary';
import { User } from '../../interfaces/User';
import {
  getAllSectionSummaries,
  getSectionSummary,
  postSectionSummary,
  putSectionSummary,
  deleteSectionSummary
} from '../models/sectionSummaryModel';

const sectionSummaryListGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getAllSectionSummaries();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const sectionSummaryGet = async (
  req: Request<{ id: number }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getSectionSummary(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const sectionSummaryPost = async (
  req: Request<{}, {}, PostSectionSummary>,
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
    const result = await postSectionSummary(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const sectionSummaryPut = async (
  req: Request<{ id: number }, {}, PutSectionSummary>,
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
    const result = await putSectionSummary(req.body, req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const sectionSummaryDelete = async (
  req: Request<{ id: number }, {}, {}>,
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
    const result = await deleteSectionSummary(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export {
  sectionSummaryListGet,
  sectionSummaryGet,
  sectionSummaryPost,
  sectionSummaryPut,
  sectionSummaryDelete
};
