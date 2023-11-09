import { validationResult } from 'express-validator';
import {
  getAnswersBySurvey,
  postAnswer,
  deleteAnswer
} from '../models/answerModel';
import { Request, Response, NextFunction } from 'express';
import CustomError from '../../classes/CustomError';
import { PostAnswer } from '../../interfaces/Answer';
import { User } from '../../interfaces/User';
import { getSurveyByKey } from '../models/surveyModel';
import MessageResponse from '../../interfaces/MessageResponse';

const answersBySurveyGet = async (
  req: Request<{ id: string }, {}, {}>,
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
  const id = parseInt(req.params.id);
  try {
    const answers = await getAnswersBySurvey(
      id,
      (req.user as User).id,
      (req.user as User).role
    );
    res.json(answers);
  } catch (error) {
    next(error);
  }
};

const answerPost = async (
  req: Request<{}, {}, PostAnswer>,
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
    const surveyId = await getSurveyByKey(req.body.survey_key as string);
    console.log(surveyId);
    if (!surveyId) {
      throw new CustomError('Survey not found', 404);
    }
    req.body.survey_id = surveyId.id;

    const answer = await postAnswer(req.body);
    res.json(answer);
  } catch (error) {
    next(error);
  }
};

const answerAllPost = async (
  req: Request<{}, {}, PostAnswer>,
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
    const surveyId = await getSurveyByKey(req.body.survey_key as string);
    if (!surveyId) {
      throw new CustomError('Survey not found', 404);
    }
    req.body.survey_id = surveyId.id;
    const data = req.body.data as PostAnswer[];
    data.forEach(async (element) => {
      element.survey_id = surveyId.id;
      await postAnswer(element);
    });
    const message: MessageResponse = {
      message: 'Answers added',
      id: surveyId.id
    };
    res.json(message);
  } catch (error) {
    next(error);
  }
};

const answerDelete = async (
  req: Request<{ id: string }, {}, {}>,
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
    const id = parseInt(req.params.id);
    const answer = await deleteAnswer(id);
    res.json(answer);
  } catch (error) {
    next(error);
  }
};

export { answersBySurveyGet, answerPost, answerDelete, answerAllPost };
