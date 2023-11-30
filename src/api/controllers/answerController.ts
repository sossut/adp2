import { validationResult } from 'express-validator';
import {
  getAnswersBySurvey,
  postAnswer,
  deleteAnswer,
  getAnswersByPostcode,
  getAnswersByCity
} from '../models/answerModel';
import { Request, Response, NextFunction } from 'express';
import CustomError from '../../classes/CustomError';
import { PostAnswer } from '../../interfaces/Answer';
import { User } from '../../interfaces/User';
import { getSurveyByKey } from '../models/surveyModel';
import MessageResponse from '../../interfaces/MessageResponse';
import { addAnswerCount } from '../models/resultModel';
import { getSurveyResultsAndCount } from '../../utils/utility';

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

const answersByPostcodeGet = async (
  req: Request<{ id: string; code: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  console.log(req.params.code);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    throw new CustomError(messages, 400);
  }
  try {
    const answers = await getAnswersByPostcode(
      (req.user as User).id,
      (req.user as User).role,
      req.params.code
    );
    res.json(answers);
  } catch (error) {
    next(error);
  }
};

const answersByCityGet = async (
  req: Request<{ id: string; name: string }, {}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().join(', ');
    throw new CustomError(messages, 400);
  }
  try {
    const answers = await getAnswersByCity(
      (req.user as User).id,
      (req.user as User).role,
      req.params.name
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

    await addAnswerCount(surveyId.id);

    await getSurveyResultsAndCount(surveyId.id);
    const response = {
      message: 'Answers added',
      id: surveyId.id,
      key: surveyId.survey_key,
      answers: data
    };
    console.log(response);
    res.json(response);
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

export {
  answersBySurveyGet,
  answersByPostcodeGet,
  answersByCityGet,
  answerPost,
  answerDelete,
  answerAllPost
};
