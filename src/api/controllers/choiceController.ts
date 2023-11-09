import { validationResult } from 'express-validator';
import {
  getAllChoices,
  getChoice,
  getChoicesByValue,
  postChoice,
  putChoice,
  deleteChoice
} from '../models/choiceModel';
import { Request, Response, NextFunction } from 'express';
import CustomError from '../../classes/CustomError';
import { PostChoice } from '../../interfaces/Choice';
import { User } from '../../interfaces/User';
import MessageResponse from '../../interfaces/MessageResponse';

const choiceListGet = async (
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
    if ((req.user as User).role !== 'admin') {
      throw new CustomError('Unauthorized', 401);
    }
    const choices = await getAllChoices();
    res.json(choices);
  } catch (error) {
    next(error);
  }
};

const choiceGet = async (
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
    const choice = await getChoice(id);
    res.json(choice);
  } catch (error) {
    next(error);
  }
};

const choiceGetByValue = async (
  req: Request<{ value: string }, {}, {}>,
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
    const value = req.params.value;
    const choice = await getChoicesByValue(value);
    res.json(choice);
  } catch (error) {
    next(error);
  }
};

const choicePost = async (
  req: Request<{}, {}, PostChoice>,
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
    const choice = await postChoice(req.body);
    if (choice) {
      const message: MessageResponse = {
        message: 'Choice added',
        id: choice
      };
      res.json(message);
    }
  } catch (error) {
    next(error);
  }
};

const choicePut = async (
  req: Request<{ id: string }, {}, PostChoice>,
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
    const choice = await putChoice(req.body, parseInt(req.params.id));
    if (choice) {
      const message: MessageResponse = {
        message: 'Choice updated',
        id: choice
      };
      res.json(message);
    }
  } catch (error) {
    next(error);
  }
};

const choiceDelete = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => error.msg)
        .join(', ');
      throw new CustomError(messages, 400);
    }
    if ((req.user as User).role !== 'admin') {
      throw new CustomError('Unauthorized', 401);
    }
    const id = parseInt(req.params.id);
    const choice = await deleteChoice(id);
    if (choice) {
      const message: MessageResponse = {
        message: 'Choice deleted',
        id: parseInt(req.params.id)
      };
      res.json(message);
    }
  } catch (error) {
    next(error);
  }
};

export {
  choiceListGet,
  choiceGet,
  choiceGetByValue,
  choicePost,
  choicePut,
  choiceDelete
};
