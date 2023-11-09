import { validationResult } from 'express-validator';

import {
  getAllSurveys,
  getSurvey,
  postSurvey,
  putSurvey,
  deleteSurvey,
  getSurveyByKey,
  getSurveysByHousingCompany
} from '../models/surveyModel';
import { Request, Response, NextFunction } from 'express';
import CustomError from '../../classes/CustomError';
import { Survey, PostSurvey } from '../../interfaces/Survey';
import { User } from '../../interfaces/User';
import MessageResponse from '../../interfaces/MessageResponse';
import {
  checkIfHousingCompanyBelongsToUser,
  getApartmentCountByHousingCompany
} from '../models/housingCompanyModel';
import { deleteResultBySurvey } from '../models/resultModel';

const surveyListGet = async (
  req: Request,
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
    const surveys = await getAllSurveys();
    res.json(surveys);
  } catch (error) {
    next(error);
  }
};

const surveyGet = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    throw new CustomError(messages, 400);
  }
  try {
    const survey = await getSurvey(parseInt(req.params.id));
    res.json(survey);
  } catch (error) {
    next(error);
  }
};

const surveyGetByKey = async (
  req: Request<{ key: string }, {}, {}>,
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
    const survey = await getSurveyByKey(req.params.key);
    res.json(survey);
  } catch (error) {
    next(error);
  }
};

const surveyListByHousingCompanyGet = async (
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
    const housingCompanyId = parseInt(req.params.id);
    const userID = (req.user as User).id;
    const role = (req.user as User).role;
    const surveys = await getSurveysByHousingCompany(
      housingCompanyId,
      userID,
      role
    );
    res.json(surveys);
  } catch (error) {
    next(error);
  }
};

const surveyPost = async (
  req: Request<{}, {}, PostSurvey>,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    throw new CustomError(messages, 400);
  }
  try {
    if ((req.user as User).role !== 'admin') {
      const checkUser = await checkIfHousingCompanyBelongsToUser(
        req.body.housing_company_id as number,
        (req.user as User).id
      );
      if (!checkUser) {
        throw new CustomError('Unauthorized', 403);
      }
    }
    const apartmentCount = await getApartmentCountByHousingCompany(
      req.body.housing_company_id as number
    );
    const user = req.user as User;
    req.body.user_id = user.id;
    if (!req.body.end_date) {
      req.body.end_date = null;
    }
    req.body.max_responses = apartmentCount;
    if (!req.body.min_responses) {
      req.body.min_responses = null;
    }
    if (!req.body.start_date) {
      req.body.start_date = null;
    }
    if (!req.body.survey_status) {
      req.body.survey_status = 'open';
    }
    const result = await postSurvey(req.body);
    if (result) {
      const message: MessageResponse = {
        message: 'survey added',
        id: result
      };
      res.json(message);
    }
  } catch (error) {
    next(error);
  }
};

const surveyPut = async (
  req: Request<{ id: string }, {}, Survey>,
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
    const survey = req.body;
    const id = parseInt(req.params.id);
    const userID = (req.user as User).id;
    const role = (req.user as User).role;
    const result = await putSurvey(survey, id, userID, role);
    if (result) {
      res.json({
        message: 'survey updated',
        id: result
      });
    }
  } catch (error) {
    next(error);
  }
};

const surveyDelete = async (
  req: Request<{ id: string }>,
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
    const userID = (req.user as User).id;
    const role = (req.user as User).role;
    await deleteResultBySurvey(parseInt(req.params.id), userID, role);
    const result = await deleteSurvey(parseInt(req.params.id), userID, role);
    if (result) {
      const message: MessageResponse = {
        message: 'survey deleted',
        id: parseInt(req.params.id)
      };
      res.json(message);
    }
  } catch (error) {
    next(error);
  }
};

export {
  surveyListGet,
  surveyGet,
  surveyPost,
  surveyPut,
  surveyDelete,
  surveyGetByKey,
  surveyListByHousingCompanyGet
};
