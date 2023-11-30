import { validationResult } from 'express-validator';
import {
  getAllResults,
  getResult,
  postResult,
  deleteResult,
  putResult
} from '../models/resultModel';

import { Request, Response, NextFunction } from 'express';
import CustomError from '../../classes/CustomError';
import { PostResult } from '../../interfaces/Result';
import MessageResponse from '../../interfaces/MessageResponse';
import { User } from '../../interfaces/User';
import { checkIfSurveyBelongsToUser } from '../models/surveyModel';
import { getSectionSummaryBySectionIdAndResult } from '../models/sectionSummaryModel';

import { getSectionsUsedInSurveyBySurveyId } from '../models/sectionsUsedInSurveyModel';

const resultListGet = async (
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
    const results = await getAllResults();
    res.json(results);
  } catch (error) {
    next(error);
  }
};

const resultGet = async (
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
    const result = await getResult(
      req.params.id,
      (req.user as User).id,
      (req.user as User).role
    );
    //localhostille
    // const parsed = JSON.parse(result.result_summary);
    // const sectionOneResult = parsed.section_one;
    // const sectionTwoResult = parsed.section_two;
    // const sectionThreeResult = parsed.section_three;

    const sectionOneResult = result.result_summary.section_one;
    const sectionTwoResult = result.result_summary.section_two;
    const sectionThreeResult = result.result_summary.section_three;

    console.log(sectionOneResult);
    console.log(sectionTwoResult);
    console.log(sectionThreeResult);

    const sections = await getSectionsUsedInSurveyBySurveyId(
      result.survey_id as number
    );
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
      result: result,
      section_summary: {
        section_one: sectionOneSummary,
        section_two: sectionTwoSummary,
        section_three: sectionThreeSummary
      }
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

const resultPost = async (
  req: Request<{}, {}, PostResult>,
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
      const checkUser = await checkIfSurveyBelongsToUser(
        req.body.survey_id as number,
        (req.user as User).id
      );
      if (!checkUser) {
        throw new CustomError('Unauthorized', 401);
      }
    }
    req.body.date_time = new Date();
    req.body.filename = req.file!.filename || 'jotain';
    const result = await postResult(req.body);
    if (result) {
      const message: MessageResponse = {
        message: 'result added',
        id: result
      };
      res.json(message);
    }
  } catch (error) {
    next(error);
  }
};

const resultPut = async (
  req: Request<{ id: string }, {}, PostResult>,
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
    const result = await putResult(
      req.body,
      parseInt(req.params.id),
      userID,
      role
    );
    if (result) {
      res.json({
        message: 'result updated',
        id: result
      });
    }
  } catch (error) {
    next(error);
  }
};

const resultDelete = async (
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
    const result = await deleteResult(parseInt(req.params.id), userID, role);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export { resultListGet, resultGet, resultPost, resultPut, resultDelete };
