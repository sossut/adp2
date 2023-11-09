import { promisePool } from '../../database/db';
import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';
import {
  Answer,
  GetAnswer,
  PostAnswer,
  PutAnswer
} from '../../interfaces/Answer';

const getAllAnswers = async (): Promise<GetAnswer[]> => {
  const [rows] = await promisePool.execute<GetAnswer[]>(
    'SELECT * FROM answers;'
  );
  if (rows.length === 0) {
    throw new CustomError('No answers found', 404);
  }
  return rows;
};

const getAnswer = async (id: string): Promise<GetAnswer> => {
  const [rows] = await promisePool.execute<GetAnswer[]>(
    'SELECT * FROM answers WHERE id = ?',
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('No answers found', 404);
  }
  return rows[0];
};

const getAnswersBySurvey = async (
  surveyID: number,
  userID: number,
  role: string
): Promise<Answer[]> => {
  let sql = `SELECT answers.id, question_id, answer, survey_id, 
    JSON_OBJECT('question', questions.question, 'weight', questions.weight, 'weight', questions.weight) AS question,
    JSON_OBJECT('survey_id', surveys.id, 'start_date', surveys.start_date, 'end_date', surveys.end_date, 'min_responses', surveys.min_responses, 'max_responses', surveys.max_responses, 'survey_status', surveys.survey_status, 'user_id', surveys.user_id, 'survey_key', surveys.survey_key, 'housing_company_id', surveys.housing_company_id) AS survey,
    JSON_OBJECT('user_id', users.id, 'user_name', users.user_name) AS user,
    JSON_OBJECT('housing_company_id', housing_companies.id, 'name', housing_companies.name) AS housing_company
	 FROM answers
    JOIN questions
    ON answers.question_id = questions.id
    JOIN surveys
    ON answers.survey_id = surveys.id
    JOIN users
    ON surveys.user_id = users.id
    JOIN housing_companies
    ON surveys.housing_company_id = housing_companies.id
    WHERE survey_id = ? AND users.id = ?;`;
  let params = [surveyID, userID];
  if (role === 'admin') {
    sql = `SELECT answers.id, question_id, answer, survey_id, 
    JSON_OBJECT('question', questions.question, 'weight', questions.weight, 'weight', questions.weight) AS question,
    JSON_OBJECT('survey_id', surveys.id, 'start_date', surveys.start_date, 'end_date', surveys.end_date, 'min_responses', surveys.min_responses, 'max_responses', surveys.max_responses, 'survey_status', surveys.survey_status, 'user_id', surveys.user_id, 'survey_key', surveys.survey_key, 'housing_company_id', surveys.housing_company_id) AS survey,
    JSON_OBJECT('user_id', users.id, 'user_name', users.user_name) AS user,
    JSON_OBJECT('housing_company_id', housing_companies.id, 'name', housing_companies.name) AS housing_company
    FROM answers
    JOIN questions
    ON answers.question_id = questions.id
    JOIN surveys
    ON answers.survey_id = surveys.id
    JOIN users
    ON surveys.user_id = users.id
    JOIN housing_companies
    ON surveys.housing_company_id = housing_companies.id
    WHERE survey_id = ?;`;
    params = [surveyID];
  }
  const format = promisePool.format(sql, params);
  const [rows] = await promisePool.execute<GetAnswer[]>(format);
  if (rows.length === 0) {
    throw new CustomError('No answers found', 404);
  }
  const answers: Answer[] = rows.map((row) => ({
    ...row,
    question: JSON.parse(row.question?.toString() || '{}'),
    survey: JSON.parse(row.survey?.toString() || '{}'),
    user: JSON.parse(row.user?.toString() || '{}'),
    housing_company: JSON.parse(row.housing_company?.toString() || '{}')
  }));
  return answers;
};

const postAnswer = async (answer: PostAnswer) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    'INSERT INTO answers (answer, question_id, survey_id) VALUES (?, ?, ?);',
    [answer.answer, answer.question_id, answer.survey_id]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Answer not created', 400);
  }
  return headers.insertId;
};

const putAnswer = async (data: PutAnswer, id: number) => {
  const sql = promisePool.format('UPDATE answers SET ? WHERE id = ?;', [
    data,
    id
  ]);
  const [headers] = await promisePool.execute<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('Answer not updated', 400);
  }
  return headers.affectedRows;
};

const deleteAnswer = async (id: number): Promise<boolean> => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    'DELETE FROM answers WHERE id = ?;',
    [id]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Answer not deleted', 400);
  }
  return true;
};

const deleteAllAnswersBySurvey = async (
  surveyID: number,
  userID: number,
  role: string
): Promise<boolean> => {
  let sql = `DELETE answers FROM answers 
  JOIN surveys
  ON answers.survey_id = surveys.id
  JOIN housing_companies
  ON surveys.housing_company_id = housing_companies.id
  JOIN users
  ON surveys.user_id = users.id
  WHERE survey_id = ? AND users.id = ?;`;
  let params = [surveyID, userID];
  if (role === 'admin') {
    sql = 'DELETE FROM answers WHERE survey_id = ?;';
    params = [surveyID];
  }
  const format = promisePool.format(sql, params);
  const [headers] = await promisePool.execute<ResultSetHeader>(format);
  if (headers.affectedRows === 0) {
    throw new CustomError('Answers not deleted', 400);
  }
  return true;
};

export {
  getAllAnswers,
  getAnswer,
  getAnswersBySurvey,
  postAnswer,
  putAnswer,
  deleteAnswer,
  deleteAllAnswersBySurvey
};
