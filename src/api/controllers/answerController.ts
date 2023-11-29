import { validationResult } from 'express-validator';
import {
  getAnswersBySurvey,
  postAnswer,
  deleteAnswer,
  getAnswersByPostcode,
  getAnswersByCity,
  checkAnswersBySurvey
} from '../models/answerModel';
import { Request, Response, NextFunction } from 'express';
import CustomError from '../../classes/CustomError';
import { PostAnswer } from '../../interfaces/Answer';
import { User } from '../../interfaces/User';
import { getSurveyByKey } from '../models/surveyModel';
import MessageResponse from '../../interfaces/MessageResponse';
import {
  addAnswerCount,
  changeResultSummary,
  getResultAnswerCount
} from '../models/resultModel';
import { getResultSummaryByValues } from '../models/resultSummaryModel';

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
    const message: MessageResponse = {
      message: 'Answers added',
      id: surveyId.id
    };
    await addAnswerCount(surveyId.id);
    const answerCount = await getResultAnswerCount(surveyId.id);

    //TÄHÄN MIN_RESPONSES
    if (answerCount < 5) {
      res.json(message);
    } else {
      const answersBySurvey = await checkAnswersBySurvey(surveyId.id);

      let section1Points = 0;
      let section2Points = 0;
      let section3Points = 0;

      const section1 = answersBySurvey.filter((answer) => {
        if (answer.section_id === 1) {
          section1Points += answer.answer;
          return answer.section_id === 1;
        }
      });
      const section2 = answersBySurvey.filter((answer) => {
        if (answer.section_id === 2) {
          section2Points += answer.answer;
          return answer.section_id === 2;
        }
      });
      const section3 = answersBySurvey.filter((answer) => {
        if (answer.section_id === 3) {
          section3Points += answer.answer;
          return answer.section_id === 3;
        }
      });

      const section1Result = section1Points / section1.length;
      const section2Result = section2Points / section2.length;
      const section3Result = section3Points / section3.length;

      console.log('Points Section 1', section1Points);
      console.log('Points Section 2', section2Points);
      console.log('Points Section 3', section3Points);

      console.log(section1Result);
      console.log(section2Result);
      console.log(section3Result);

      const valueCheck = (value: number) => {
        if (value > 0.5) {
          return 'positive';
        } else if (value <= 0.5 && value > 0) {
          return 'even';
        } else if (value <= 0) {
          return 'negative';
        }
      };

      const section1ResultValue = valueCheck(section1Result) as String;
      const section2ResultValue = valueCheck(section2Result) as String;
      const section3ResultValue = valueCheck(section3Result) as String;

      const resultSummaryId = await getResultSummaryByValues(
        section1ResultValue.toString(),
        section2ResultValue.toString(),
        section3ResultValue.toString()
      );
      if (!resultSummaryId) {
        throw new CustomError('Result summary not found', 404);
      }
      await changeResultSummary(resultSummaryId.id, surveyId.id);

      res.json(message);
    }
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
