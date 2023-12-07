import { validationResult } from 'express-validator';
import {
  getAllResults,
  getResult,
  postResult,
  deleteResult,
  putResult,
  getResultBySurveyId
} from '../models/resultModel';

import { Request, Response, NextFunction } from 'express';
import CustomError from '../../classes/CustomError';
import { PostResult } from '../../interfaces/Result';
import MessageResponse from '../../interfaces/MessageResponse';
import { User } from '../../interfaces/User';
import { checkIfSurveyBelongsToUser } from '../models/surveyModel';
import { getSectionSummaryBySectionIdAndResult } from '../models/sectionSummaryModel';

import { getSectionsUsedInSurveyBySurveyId } from '../models/sectionsUsedInSurveyModel';
import {
  checkAnswersBySurvey,
  getAnswersByPostcodeId,
  getThreeBestAnswerScoresBySurvey,
  getThreeWorstAnswerScoresBySurvey
} from '../models/answerModel';
import { categoryCounter, getSurveyResultsAndCount } from '../../utils/utility';
import { getPostcode } from '../models/postcodeModel';

const resultListGet = async (
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

    const results = await getAllResults(
      (req.user as User).id,
      (req.user as User).role
    );
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
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }
    const result = await getResult(
      req.params.id,
      (req.user as User).id,
      (req.user as User).role
    );
    const resultValues = await getSurveyResultsAndCount(
      result.survey_id as number
    );
    const { totalResultValue } = resultValues as any;

    //localhostille
    // const parsed = JSON.parse(result.result_summary);
    // const sectionOneResult = parsed.section_one;
    // const sectionTwoResult = parsed.section_two;
    // const sectionThreeResult = parsed.section_three;

    const sectionOneResult = result.result_summary.section_one;
    const sectionTwoResult = result.result_summary.section_two;
    const sectionThreeResult = result.result_summary.section_three;

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

    const threeBestScores = await getThreeBestAnswerScoresBySurvey(
      result.survey_id as number
    );
    const threeWorstScores = await getThreeWorstAnswerScoresBySurvey(
      result.survey_id as number
    );

    const answers = await checkAnswersBySurvey(result.survey_id as number);
    const categories = categoryCounter(answers);
    const categoryOneResult = categories.categoryOneResult;
    const categoryTwoResult = categories.categoryTwoResult;
    const categoryThreeResult = categories.categoryThreeResult;
    const categoryFourResult = categories.categoryFourResult;
    const categoryFiveResult = categories.categoryFiveResult;
    const categorySixResult = categories.categorySixResult;
    const categorySevenResult = categories.categorySevenResult;
    const categoryEightResult = categories.categoryEightResult;
    const categoryNineResult = categories.categoryNineResult;
    const categoryTenResult = categories.categoryTenResult;

    const response = {
      result: result,
      total_result: totalResultValue,
      section_summary: {
        section_one: sectionOneSummary,
        section_two: sectionTwoSummary,
        section_three: sectionThreeSummary
      },
      three_best_scores: threeBestScores,
      three_worst_scores: threeWorstScores,
      category_results: {
        category_temperature: categoryOneResult,
        category_lighting: categoryTwoResult,
        category_airquality: categoryThreeResult,
        category_repairs_personalr: categoryFourResult,
        category_upkeep_personal: categoryFiveResult,
        category_energyefficiency: categorySixResult,
        category_participation: categorySevenResult,
        category_upkeep_hc: categoryEightResult,
        category_economy: categoryNineResult,
        category_community: categoryTenResult
      }
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

const resultGetBySurveyId = async (
  req: Request<{ surveyID: string }, {}, {}>,
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
    const result = await getResultBySurveyId(
      parseInt(req.params.surveyID),
      (req.user as User).id,
      (req.user as User).role
    );
    const resultValues = await getSurveyResultsAndCount(
      result.survey_id as number
    );
    const { totalResultValue } = resultValues as any;
    //localhostille
    // const parsed = JSON.parse(result.result_summary);
    // const sectionOneResult = parsed.section_one;
    // const sectionTwoResult = parsed.section_two;
    // const sectionThreeResult = parsed.section_three;

    const sectionOneResult = result.result_summary.section_one;
    const sectionTwoResult = result.result_summary.section_two;
    const sectionThreeResult = result.result_summary.section_three;

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

    const threeBestScores = await getThreeBestAnswerScoresBySurvey(
      result.survey_id as number
    );
    const threeWorstScores = await getThreeWorstAnswerScoresBySurvey(
      result.survey_id as number
    );

    const answers = await checkAnswersBySurvey(result.survey_id as number);
    const categories = categoryCounter(answers);
    const categoryOneResult = categories.categoryOneResult;
    const categoryTwoResult = categories.categoryTwoResult;
    const categoryThreeResult = categories.categoryThreeResult;
    const categoryFourResult = categories.categoryFourResult;
    const categoryFiveResult = categories.categoryFiveResult;
    const categorySixResult = categories.categorySixResult;
    const categorySevenResult = categories.categorySevenResult;
    const categoryEightResult = categories.categoryEightResult;
    const categoryNineResult = categories.categoryNineResult;
    const categoryTenResult = categories.categoryTenResult;

    const response = {
      result: result,
      total_result: totalResultValue,
      section_summary: {
        section_one: sectionOneSummary,
        section_two: sectionTwoSummary,
        section_three: sectionThreeSummary
      },
      three_best_scores: threeBestScores,
      three_worst_scores: threeWorstScores,
      category_results: {
        category_temperature: categoryOneResult,
        category_lighting: categoryTwoResult,
        category_airquality: categoryThreeResult,
        category_repairs_personalr: categoryFourResult,
        category_upkeep_personal: categoryFiveResult,
        category_energyefficiency: categorySixResult,
        category_participation: categorySevenResult,
        category_upkeep_hc: categoryEightResult,
        category_economy: categoryNineResult,
        category_community: categoryTenResult
      }
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

const resultGetByPostcodeId = async (
  req: Request<{ postcodeID: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const message = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(message, 400);
    }
    const postcodeID = parseInt(req.params.postcodeID);
    const {
      totalResultValue,
      section1ResultValue,
      section2ResultValue,
      section3ResultValue
    } = (await getSurveyResultsAndCount(
      postcodeID,
      getAnswersByPostcodeId,
      (req.user as User).id,
      (req.user as User).role
    )) as any;
    const postcode = await getPostcode(req.params.postcodeID);
    const response = {
      postcode: postcode,
      total_result: totalResultValue,
      section_summary: {
        section_one: section1ResultValue,
        section_two: section2ResultValue,
        section_three: section3ResultValue
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
    const result = await deleteResult(parseInt(req.params.id), userID, role);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export {
  resultListGet,
  resultGet,
  resultGetBySurveyId,
  resultGetByPostcodeId,
  resultPost,
  resultPut,
  resultDelete
};
