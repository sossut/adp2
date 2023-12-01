import { checkAnswersBySurvey } from '../api/models/answerModel';
import { getResultAnswerCount } from '../api/models/resultModel';
import { getResultSummaryByValues } from '../api/models/resultSummaryModel';
import { changeResultSummary } from '../api/models/resultModel';
import CustomError from '../classes/CustomError';

const getSurveyResultsAndCount = async (surveyId: number) => {
  const answerCount = await getResultAnswerCount(surveyId);

  //TÄHÄN MIN_RESPONSES
  if (answerCount < 5) {
    return;
  } else {
    const answersBySurvey = await checkAnswersBySurvey(surveyId);

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

    //KYSY TOPILTA MIKSKÄ NÄÄ VOIS LAITTAA
    const valueCheck = (value: number) => {
      if (value > 0.4) {
        return 'positive';
      } else if (value <= 0.4 && value > -0.2) {
        return 'even';
      } else if (value <= -0.2) {
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
    await changeResultSummary(resultSummaryId.id, surveyId);
  }
};

export { getSurveyResultsAndCount };
