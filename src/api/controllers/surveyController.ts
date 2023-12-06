import { validationResult } from 'express-validator';

import {
  getAllSurveys,
  getSurvey,
  postSurvey,
  putSurvey,
  deleteSurvey,
  getSurveyByKey,
  getSurveysByHousingCompany,
  checkIfSurveyKeyExists
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
import { deleteResultBySurvey, postResult } from '../models/resultModel';
import { getAllActiveQuestions } from '../models/questionModel';
import { postQuestionsUsedInSurvey } from '../models/questionsUsedInSurveyModel';
import { QuestionsUsedInSurvey } from '../../interfaces/QuestionsUsedInSurvey';
import { getAllSections } from '../models/sectionModel';
import { postSectionsUsedInSurvey } from '../models/sectionsUsedInSurveyModel';
import { SectionsUsedInSurvey } from '../../interfaces/SectionsUsedInSurvey';
import { PostResult } from '../../interfaces/Result';
import { getSurveyResultsAndCount } from '../../utils/utility';
// eslint-disable-next-line import/no-extraneous-dependencies
var randomstring = require('randomstring');

const surveyListGet = async (
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
    const surveys = await getAllSurveys(
      (req.user as User).id,
      (req.user as User).role
    );
    await Promise.all(
      surveys.map(async (survey) => {
        const result = await getSurveyResultsAndCount(survey.id);
        const { totalResultValue } = result as any;
        survey.result_value = totalResultValue;
      })
    );
    res.json(surveys);
  } catch (error) {
    next(error);
  }
};

const surveyGet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }
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
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }
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
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }
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
  try {
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }
    const activeQuestions = await getAllActiveQuestions();
    if (activeQuestions.length === 0) {
      throw new CustomError('No active questions', 400);
    }
    const sections = await getAllSections();
    if (sections.length === 0) {
      throw new CustomError('No sections', 400);
    }
    const jsonQuestions = JSON.stringify(activeQuestions);
    req.body.questions_used = jsonQuestions;
    const jsonSections = JSON.stringify(sections);
    req.body.sections_used = jsonSections;
    let check = true;
    while (check) {
      const key = randomstring.generate(12);
      check = await checkIfSurveyKeyExists(key);
      if (!check) {
        req.body.survey_key = key;
      }
    }
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
      const questionsUsed = {
        questions_used: jsonQuestions,
        survey_id: result
      } as QuestionsUsedInSurvey;
      const sectionsUsed = {
        sections_used: jsonSections,
        survey_id: result
      } as SectionsUsedInSurvey;
      const result2 = await postQuestionsUsedInSurvey(questionsUsed);
      const result3 = await postSectionsUsedInSurvey(sectionsUsed);
      const resultData = {
        survey_id: result,
        date_time: new Date(),
        filename: 'jotain',
        result_summary_id: 1,
        answer_count: 0
      } as PostResult;
      const resultResult = await postResult(resultData);
      if (result2 && result3 && resultResult) {
        res.json(message);
      }
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
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }
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
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }
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
