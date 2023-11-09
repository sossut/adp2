import { validationResult } from 'express-validator';
import {
  getAllSections,
  getSection,
  postSection,
  putSection,
  deleteSection
} from '../models/sectionModel';
import { Request, Response, NextFunction } from 'express';
import CustomError from '../../classes/CustomError';
import { PostSection } from '../../interfaces/Section';
import { User } from '../../interfaces/User';

const sectionGet = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const section = await getSection(req.params.id);
    res.json(section);
  } catch (error) {
    next(error);
  }
};

const sectionListGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const questions = await getAllSections();
    res.json(questions);
  } catch (error) {
    next(error);
  }
};

const sectionPost = async (
  req: Request<{}, {}, PostSection>,
  res: Response,
  next: NextFunction
) => {
  try {
    if ((req.user as User).role !== 'admin') {
      throw new CustomError('Unauthorized', 401);
    }
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }
    const result = await postSection(req.body);
    if (result) {
      res.json({
        message: 'section added',
        section_id: result
      });
    } else {
      throw new CustomError('no section inserted', 400);
    }
  } catch (error) {
    next(error);
  }
};

const sectionPut = async (
  req: Request<{ id: string }, {}, PostSection>,
  res: Response,
  next: NextFunction
) => {
  try {
    if ((req.user as User).role !== 'admin') {
      throw new CustomError('Unauthorized', 401);
    }
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');

      throw new CustomError(messages, 400);
    }
    const section = req.body;
    const result = await putSection(section, parseInt(req.params.id));
    if (result) {
      res.json({
        message: 'section updated'
      });
    }
  } catch (error) {
    next(error);
  }
};

const sectionDelete = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    if ((req.user as User).role !== 'admin') {
      throw new CustomError('Unauthorized', 401);
    }
    const result = await deleteSection(parseInt(req.params.id));
    if (result) {
      res.json({
        message: 'section deleted'
      });
    }
  } catch (error) {
    next(error);
  }
};

export { sectionGet, sectionListGet, sectionPost, sectionPut, sectionDelete };
