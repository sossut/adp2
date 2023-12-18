import { validationResult } from 'express-validator';
import {
  getQuestionnaire,
  getAllQuestionnaires,
  postQuestionnaire,
  putQuestionnaire,
  deleteQuestionnaire,
  getQuestionnaireBySurveyKey
} from '../models/questionnaraireModal';

import { Request, Response, NextFunction } from 'express';

import CustomError from '../../classes/CustomError';

import {
  PostQuestionnaire,
  PutQuestionnaire
} from '../../interfaces/Questionnaire';
import { User } from '../../interfaces/User';

const questionnaireListGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const questionnaires = await getAllQuestionnaires();
    res.json(questionnaires);
  } catch (error) {
    next(error);
  }
};

const questionnaireGet = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const questionnaire = await getQuestionnaire(req.params.id);
    res.json(questionnaire);
  } catch (error) {
    next(error);
  }
};

const questionnaireGetBySurveyKey = async (
  req: Request<{ key: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const questionnaire = await getQuestionnaireBySurveyKey(req.params.key);
    res.json(questionnaire);
  } catch (error) {
    next(error);
  }
};

const questionnairePost = async (
  req: Request<{}, {}, PostQuestionnaire>,
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
    const result = await postQuestionnaire(req.body);
    if (result) {
      res.json({
        message: 'questionnaire added',
        id: result
      });
    } else {
      throw new CustomError('no questionnaire inserted', 400);
    }
  } catch (error) {
    next(error);
  }
};

const questionnairePut = async (
  req: Request<{ id: string }, {}, PutQuestionnaire>,
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
      throw new CustomError('Unauthorized', 401);
    }

    const result = await putQuestionnaire(parseInt(req.params.id), req.body);
    if (result) {
      res.json({
        message: 'questionnaire updated'
      });
    }
  } catch (error) {
    next(error);
  }
};

const questionnaireDelete = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    if ((req.user as User).role !== 'admin') {
      throw new CustomError('Unauthorized', 401);
    }
    const result = await deleteQuestionnaire(parseInt(req.params.id));
    if (result) {
      res.json({
        message: 'questionnaire deleted'
      });
    }
  } catch (error) {
    next(error);
  }
};

export {
  questionnaireListGet,
  questionnaireGet,
  questionnaireGetBySurveyKey,
  questionnairePost,
  questionnairePut,
  questionnaireDelete
};
