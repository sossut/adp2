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

import { addAnswerCount, getResultAnswerCount } from '../models/resultModel';
import { getSurveyResultsAndCount } from '../../utils/utility';
import { getResultSummaryByValues } from '../models/resultSummaryModel';
import { getSectionsUsedInSurveyBySurveyId } from '../models/sectionsUsedInSurveyModel';
import { getSectionSummaryBySectionIdAndResult } from '../models/sectionSummaryModel';

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
    const survey = await getSurveyByKey(req.body.survey_key as string);
    if (!survey) {
      throw new CustomError('Survey not found', 404);
    }
    req.body.survey_id = survey.id;
    const data = req.body.data as PostAnswer[];
    data.forEach(async (element) => {
      element.survey_id = survey.id;
      await postAnswer(element);
    });
    await getResultAnswerCount(survey.id);
    await addAnswerCount(survey.id);

    await getSurveyResultsAndCount(survey.id);
    try {
      let section1Points = 0;
      let section2Points = 0;
      let section3Points = 0;

      const section1 = data.filter((answer) => {
        if (answer.section_id == 1) {
          section1Points += parseInt(answer.answer as unknown as string);
          return answer.section_id == 1;
        }
      });
      const section2 = data.filter((answer) => {
        if (answer.section_id == 2) {
          section2Points += parseInt(answer.answer as unknown as string);
          return answer.section_id == 2;
        }
      });
      const section3 = data.filter((answer) => {
        if (answer.section_id == 3) {
          section3Points += parseInt(answer.answer as unknown as string);
          return answer.section_id == 3;
        }
      });

      const section1Result = section1Points / section1.length;
      const section2Result = section2Points / section2.length;
      const section3Result = section3Points / section3.length;

      //KYSY TOPILTA MIKSKÄ NÄÄ VOIS LAITTAA
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

      const resultSummary = await getResultSummaryByValues(
        section1ResultValue.toString(),
        section2ResultValue.toString(),
        section3ResultValue.toString()
      );
      console.log(resultSummary);
      if (!resultSummary) {
        throw new CustomError('Result summary not found', 404);
      }
      const sectionOneResult = resultSummary.section_one;
      const sectionTwoResult = resultSummary.section_two;
      const sectionThreeResult = resultSummary.section_three;
      const sections = await getSectionsUsedInSurveyBySurveyId(survey.id);

      const sectionParsed = JSON.parse(sections.sections_used);

      const sectionIDs = sectionParsed.map((section: any) => section.id);

      const sectionOneSummary = await getSectionSummaryBySectionIdAndResult(
        sectionIDs[0],
        sectionOneResult as string
      );
      const sectionTwoSummary = await getSectionSummaryBySectionIdAndResult(
        sectionIDs[1],
        sectionTwoResult
      );
      const sectionThreeSummary = await getSectionSummaryBySectionIdAndResult(
        sectionIDs[2],
        sectionThreeResult
      );

      const response = {
        message: 'Answers added',
        id: survey.id,
        key: survey.survey_key,
        answers: data,
        result: {
          summary: resultSummary,
          section_one: sectionOneSummary,
          section_two: sectionTwoSummary,
          section_three: sectionThreeSummary
        }
      };
      res.json(response);
    } catch (error) {
      next(error);
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
