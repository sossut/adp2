import { ResultSetHeader } from 'mysql2';
import { promisePool } from '../../database/db';

import CustomError from '../../classes/CustomError';

import {
  QuestionsUsedInSurvey,
  GetQuestionsUsedInSurvey,
  PostQuestionsUsedInSurvey,
  PutQuestionsUsedInSurvey
} from '../../interfaces/QuestionsUsedInSurvey';

const getAllQuestionsUsedInSurvey = async (): Promise<
  QuestionsUsedInSurvey[]
> => {
  const [rows] = await promisePool.execute<GetQuestionsUsedInSurvey[]>(
    'SELECT * FROM questions_used_in_survey;'
  );
  if (rows.length === 0) {
    throw new CustomError('No questions_used_in_survey found', 404);
  }
  return rows;
};

const getQuestionsUsedInSurvey = async (
  id: string
): Promise<QuestionsUsedInSurvey> => {
  const [rows] = await promisePool.execute<GetQuestionsUsedInSurvey[]>(
    'SELECT * FROM questions_used_in_survey WHERE id = ?',
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('No questions_used_in_survey found', 404);
  }
  return rows[0];
};

const getQuestionsUsedInSurveyBySurveyKey = async (
  survey_key: string
): Promise<QuestionsUsedInSurvey> => {
  const [rows] = await promisePool.execute<GetQuestionsUsedInSurvey[]>(
    `SELECT questions_used_in_survey.id, questions_used, survey_id,
    JSON_OBJECT('survey_id', surveys.id, 'survey_key', surveys.survey_key, 'start_date', surveys.start_date, 'end_date', surveys.end_date, 'min_responses', surveys.min_responses,
    'max_responses', surveys.max_responses, 'housing_company_id', housing_company_id) AS survey
    FROM questions_used_in_survey
    JOIN surveys
    ON questions_used_in_survey.survey_id = surveys.id
    WHERE surveys.survey_key = ?`,
    [survey_key]
  );
  if (rows.length === 0) {
    throw new CustomError('No questions_used_in_survey found', 404);
  }
  return rows[0];
};

const getQuestionsUsedInSurveyBySurveyId = async (
  surveyId: number
): Promise<QuestionsUsedInSurvey> => {
  const [rows] = await promisePool.execute<GetQuestionsUsedInSurvey[]>(
    `SELECT questions_used_in_survey.id, questions_used, survey_id
    FROM questions_used_in_survey
    WHERE questions_used_in_survey.survey_id = ?;`,
    [surveyId]
  );
  if (rows.length === 0) {
    throw new CustomError('No questions_used_in_survey found', 404);
  }
  return rows[0];
};

const postQuestionsUsedInSurvey = async (
  questionsUsedInSurvey: PostQuestionsUsedInSurvey
) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    'INSERT INTO questions_used_in_survey (survey_id, questions_used) VALUES (?, ?);',
    [questionsUsedInSurvey.survey_id, questionsUsedInSurvey.questions_used]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('questions_used_in_survey not created', 400);
  }
  return headers.insertId;
};

const putQuestionsUsedInSurvey = async (
  data: PutQuestionsUsedInSurvey,
  id: number
) => {
  const sql = promisePool.format(
    'UPDATE questions_used_in_survey SET ? WHERE id = ?;',
    [data, id]
  );
  const [headers] = await promisePool.execute<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('questions_used_in_survey not updated', 400);
  }
  return headers.affectedRows;
};

const deleteQuestionsUsedInSurvey = async (id: number) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    'DELETE FROM questions_used_in_survey WHERE id = ?;',
    [id]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('questions_used_in_survey not deleted', 400);
  }
  return headers.affectedRows;
};

export {
  getAllQuestionsUsedInSurvey,
  getQuestionsUsedInSurvey,
  getQuestionsUsedInSurveyBySurveyKey,
  getQuestionsUsedInSurveyBySurveyId,
  postQuestionsUsedInSurvey,
  putQuestionsUsedInSurvey,
  deleteQuestionsUsedInSurvey
};
