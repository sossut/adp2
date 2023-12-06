import { validationResult } from 'express-validator';
import {
  getAnswersBySurvey,
  postAnswer,
  deleteAnswer,
  getAnswersByPostcodeId,
  getAnswersByCity
} from '../models/answerModel';
import { Request, Response, NextFunction } from 'express';
import CustomError from '../../classes/CustomError';
import { PostAnswer } from '../../interfaces/Answer';
import { User } from '../../interfaces/User';
import { getSurveyByKey } from '../models/surveyModel';

import { addAnswerCount, getResultAnswerCount } from '../models/resultModel';
import { getSurveyResultsAndCount, valueCheck } from '../../utils/utility';

import { getQuestionCategorySummaryByCategoryIdAndResult } from '../models/questionCategorySummaryModel';
import { getUserSectionSummaryBySectionIdAndResult } from '../models/userSectionSummaryModel';

const answersBySurveyGet = async (
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
    const id = parseInt(req.params.id);
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
  req: Request<{ id: string; postcodeID: string }, {}, {}>,
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
    const answers = await getAnswersByPostcodeId(
      (req.user as User).id,
      (req.user as User).role,
      parseInt(req.params.postcodeID)
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
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors.array().join(', ');
      throw new CustomError(messages, 400);
    }
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
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }
    const surveyId = await getSurveyByKey(req.body.survey_key as string);

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
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }
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
    let categoryOnePoints = 0;
    let categoryTwoPoints = 0;
    let categoryThreePoints = 0;
    let categoryFourPoints = 0;
    let categoryFivePoints = 0;
    let categorySixPoints = 0;
    let categorySevenPoints = 0;
    let categoryEightPoints = 0;
    let categoryNinePoints = 0;
    let categoryTenPoints = 0;
    let points = 0;
    const categoryOne = [];
    const categoryTwo = [];
    const categoryThree = [];
    const categoryFour = [];
    const categoryFive = [];
    const categorySix = [];
    const categorySeven = [];
    const categoryEight = [];
    const categoryNine = [];
    const categoryTen = [];
    data.forEach((answer) => {
      points += parseInt(answer.answer as unknown as string);
      switch (answer.question_category_id as unknown as string) {
        case '1':
          categoryOnePoints += parseInt(answer.answer as unknown as string);
          categoryOne.push(answer);
          break;
        case '2':
          categoryTwoPoints += parseInt(answer.answer as unknown as string);
          categoryTwo.push(answer);
          break;
        case '3':
          categoryThreePoints += parseInt(answer.answer as unknown as string);
          categoryThree.push(answer);
          break;
        case '4':
          categoryFourPoints += parseInt(answer.answer as unknown as string);
          categoryFour.push(answer);
          break;
        case '5':
          categoryFivePoints += parseInt(answer.answer as unknown as string);
          categoryFive.push(answer);
          break;
        case '6':
          categorySixPoints += parseInt(answer.answer as unknown as string);
          categorySix.push(answer);
          break;
        case '7':
          categorySevenPoints += parseInt(answer.answer as unknown as string);
          categorySeven.push(answer);
          break;
        case '8':
          categoryEightPoints += parseInt(answer.answer as unknown as string);
          categoryEight.push(answer);
          break;
        case '9':
          categoryNinePoints += parseInt(answer.answer as unknown as string);
          categoryNine.push(answer);
          break;
        case '10':
          categoryTenPoints += parseInt(answer.answer as unknown as string);
          categoryTen.push(answer);
          break;
      }
    });

    const categoryOneResult = categoryOnePoints / categoryOne.length;
    const categoryTwoResult = categoryTwoPoints / categoryTwo.length;
    const categoryThreeResult = categoryThreePoints / categoryThree.length;
    const categoryFourResult = categoryFourPoints / categoryFour.length;
    const categoryFiveResult = categoryFivePoints / categoryFive.length;
    const categorySixResult = categorySixPoints / categorySix.length;
    const categorySevenResult = categorySevenPoints / categorySeven.length;
    const categoryEightResult = categoryEightPoints / categoryEight.length;
    const categoryNineResult = categoryNinePoints / categoryNine.length;
    const categoryTenResult = categoryTenPoints / categoryTen.length;

    const pointsValue = valueCheck(points) as String;
    const categoryOneResultValue = valueCheck(categoryOneResult) as String;
    const categoryTwoResultValue = valueCheck(categoryTwoResult) as String;
    const categoryThreeResultValue = valueCheck(categoryThreeResult) as String;
    const categoryFourResultValue = valueCheck(categoryFourResult) as String;
    const categoryFiveResultValue = valueCheck(categoryFiveResult) as String;
    const categorySixResultValue = valueCheck(categorySixResult) as String;
    const categorySevenResultValue = valueCheck(categorySevenResult) as String;
    const categoryEightResultValue = valueCheck(categoryEightResult) as String;
    const categoryNineResultValue = valueCheck(categoryNineResult) as String;
    const categoryTenResultValue = valueCheck(categoryTenResult) as String;

    const catetegoryOneSummary =
      await getQuestionCategorySummaryByCategoryIdAndResult(
        1,
        categoryOneResultValue.toString()
      );
    const catetegoryTwoSummary =
      await getQuestionCategorySummaryByCategoryIdAndResult(
        2,
        categoryTwoResultValue.toString()
      );
    const catetegoryThreeSummary =
      await getQuestionCategorySummaryByCategoryIdAndResult(
        3,
        categoryThreeResultValue.toString()
      );
    const catetegoryFourSummary =
      await getQuestionCategorySummaryByCategoryIdAndResult(
        4,
        categoryFourResultValue.toString()
      );
    const catetegoryFiveSummary =
      await getQuestionCategorySummaryByCategoryIdAndResult(
        5,
        categoryFiveResultValue.toString()
      );
    const catetegorySixSummary =
      await getQuestionCategorySummaryByCategoryIdAndResult(
        6,
        categorySixResultValue.toString()
      );
    const catetegorySevenSummary =
      await getQuestionCategorySummaryByCategoryIdAndResult(
        7,
        categorySevenResultValue.toString()
      );
    const catetegoryEightSummary =
      await getQuestionCategorySummaryByCategoryIdAndResult(
        8,
        categoryEightResultValue.toString()
      );
    const catetegoryNineSummary =
      await getQuestionCategorySummaryByCategoryIdAndResult(
        9,
        categoryNineResultValue.toString()
      );
    const catetegoryTenSummary =
      await getQuestionCategorySummaryByCategoryIdAndResult(
        10,
        categoryTenResultValue.toString()
      );

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

      const section1ResultValue = valueCheck(section1Result) as String;
      const section2ResultValue = valueCheck(section2Result) as String;
      const section3ResultValue = valueCheck(section3Result) as String;

      const sectionOneSummary = await getUserSectionSummaryBySectionIdAndResult(
        1,
        section1ResultValue.toString()
      );

      const sectionTwoSummary = await getUserSectionSummaryBySectionIdAndResult(
        2,
        section2ResultValue.toString()
      );

      const sectionThreeSummary =
        await getUserSectionSummaryBySectionIdAndResult(
          3,
          section3ResultValue.toString()
        );

      const response = {
        message: 'Answers added',
        id: survey.id,
        key: survey.survey_key,
        answers: data,
        result: {
          summary: pointsValue,
          section_summaries: {
            section_one: sectionOneSummary,
            section_two: sectionTwoSummary,
            section_three: sectionThreeSummary
          },
          category_summaries: {
            section_one: {
              category_temperature: {
                summary: catetegoryOneSummary,
                points: categoryOneResult
              },
              category_lighting: {
                summary: catetegoryTwoSummary,
                points: categoryTwoResult
              },
              category_airquality: {
                summary: catetegoryThreeSummary,
                points: categoryThreeResult
              },
              category_repairs_personal: {
                summary: catetegoryFourSummary,
                points: categoryFourResult
              },
              category_upkeep_personal: {
                summary: catetegoryFiveSummary,
                points: categoryFiveResult
              }
            },
            section_two: {
              category_energyefficiency: {
                summary: catetegorySixSummary,
                points: categorySixResult
              },
              category_participation: {
                summary: catetegorySevenSummary,
                points: categorySevenResult
              }
            },
            section_three: {
              category_upkeep_hc: {
                summary: catetegoryEightSummary,
                points: categoryEightResult
              },
              category_economy: {
                summary: catetegoryNineSummary,
                points: categoryNineResult
              },
              category_community: {
                summary: catetegoryTenSummary,
                points: categoryTenResult
              }
            }
          }
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
