import { checkAnswersBySurvey } from '../api/models/answerModel';
import { getResultAnswerCount } from '../api/models/resultModel';
import { getResultSummaryByValues } from '../api/models/resultSummaryModel';
import { changeResultSummary } from '../api/models/resultModel';
import CustomError from '../classes/CustomError';
import { Answer } from '../interfaces/Answer';
const valueCheck = (value: number) => {
  if (value > 0.4) {
    return 'positive';
  } else if (value <= 0.4 && value > -0.2) {
    return 'even';
  } else if (value <= -0.2) {
    return 'negative';
  }
};

const categoryCounter = (array: Answer[]) => {
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
  array.forEach((answer) => {
    switch (answer.question_category_id) {
      case 1:
        categoryOnePoints += answer.answer;
        categoryOne.push(answer);
        break;
      case 2:
        categoryTwoPoints += answer.answer;
        categoryTwo.push(answer);
        break;
      case 3:
        categoryThreePoints += answer.answer;
        categoryThree.push(answer);
        break;
      case 4:
        categoryFourPoints += answer.answer;
        categoryFour.push(answer);
        break;
      case 5:
        categoryFivePoints += answer.answer;
        categoryFive.push(answer);
        break;
      case 6:
        categorySixPoints += answer.answer;
        categorySix.push(answer);
        break;
      case 7:
        categorySevenPoints += answer.answer;
        categorySeven.push(answer);
        break;
      case 8:
        categoryEightPoints += answer.answer;
        categoryEight.push(answer);
        break;
      case 9:
        categoryNinePoints += answer.answer;
        categoryNine.push(answer);
        break;
      case 10:
        categoryTenPoints += answer.answer;
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
  return {
    categoryOneResult,
    categoryTwoResult,
    categoryThreeResult,
    categoryFourResult,
    categoryFiveResult,
    categorySixResult,
    categorySevenResult,
    categoryEightResult,
    categoryNineResult,
    categoryTenResult
  };
};
const getSurveyResultsAndCount = async (surveyId: number) => {
  const answerCount = await getResultAnswerCount(surveyId);

  //TÄHÄN MIN_RESPONSES
  if (answerCount < 5) {
    return 'not enough answers';
  } else {
    const answersBySurvey = await checkAnswersBySurvey(surveyId);

    let section1Points = 0;
    let section2Points = 0;
    let section3Points = 0;
    let points = 0;

    // let section1 = [];
    // let section2 = [];
    // let section3 = [];

    // answersBySurvey.forEach((answer) => {
    //   points += answer.answer;
    //   switch (answer.section_id as unknown as string) {
    //     case 1:
    //       section1.push(answer);
    //       section1Points += answer.answer;
    //       break;
    //     case 2:
    //       section2.push(answer);
    //       section2Points += answer.answer;
    //       break;
    //     case 3:
    //       section3.push(answer);
    //       section3Points += answer.answer;
    //       break;
    //   }
    // });

    const section1 = answersBySurvey.filter((answer) => {
      points += answer.answer;
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
    const totalResult = points / answersBySurvey.length;

    const section1ResultValue = valueCheck(section1Result) as String;
    const section2ResultValue = valueCheck(section2Result) as String;
    const section3ResultValue = valueCheck(section3Result) as String;
    const totalResultValue = valueCheck(totalResult) as String;

    const resultSummaryId = await getResultSummaryByValues(
      section1ResultValue.toString(),
      section2ResultValue.toString(),
      section3ResultValue.toString()
    );
    if (!resultSummaryId) {
      throw new CustomError('Result summary not found', 404);
    }
    await changeResultSummary(resultSummaryId.id, surveyId);
    return totalResultValue;
  }
};

export { getSurveyResultsAndCount, valueCheck, categoryCounter };
