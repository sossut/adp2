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
    JSON_OBJECT('question', questions.question, 'weight', questions.weight, 'weight', questions.weight, 'section_id', questions.section_id) AS question,
    JSON_OBJECT('survey_id', surveys.id, 'start_date', surveys.start_date, 'end_date', surveys.end_date, 'min_responses', surveys.min_responses, 'max_responses', surveys.max_responses, 'survey_status', surveys.survey_status, 'user_id', surveys.user_id, 'survey_key', surveys.survey_key, 'housing_company_id', surveys.housing_company_id) AS survey,
    JSON_OBJECT('user_id', users.id, 'username', users.username) AS user,
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
    JSON_OBJECT('question', questions.question, 'weight', questions.weight, 'weight', questions.weight, 'section_id', questions.section_id) AS question,
    JSON_OBJECT('survey_id', surveys.id, 'start_date', surveys.start_date, 'end_date', surveys.end_date, 'min_responses', surveys.min_responses, 'max_responses', surveys.max_responses, 'survey_status', surveys.survey_status, 'user_id', surveys.user_id, 'survey_key', surveys.survey_key, 'housing_company_id', surveys.housing_company_id) AS survey,
    JSON_OBJECT('user_id', users.id, 'username', users.username) AS user,
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
  // return rows;
};

const checkAnswersBySurvey = async (surveyID: number): Promise<Answer[]> => {
  const [rows] = await promisePool.execute<GetAnswer[]>(
    `SELECT answers.id, question_id, answer, survey_id, questions.section_id, questions.question_category_id
    FROM answers
    JOIN questions
    ON answers.question_id = questions.id
    WHERE survey_id = ?;`,
    [surveyID]
  );
  if (rows.length === 0) {
    throw new CustomError('No answers found', 404);
  }
  return rows;
};

const getAnswersByPostcodeId = async (
  userID: number,
  role: string,
  postcodeID: number
): Promise<Answer[]> => {
  let sql = `SELECT answers.id, question_id, answer, survey_id, questions.section_id, questions.question_category_id,
    JSON_OBJECT('question', questions.question, 'weight', questions.weight, 'weight', questions.weight) AS question,
    JSON_OBJECT('survey_id', surveys.id, 'start_date', surveys.start_date, 'end_date', surveys.end_date, 'min_responses', surveys.min_responses, 'max_responses', surveys.max_responses, 'survey_status', surveys.survey_status, 'user_id', surveys.user_id, 'survey_key', surveys.survey_key, 'housing_company_id', surveys.housing_company_id) AS survey,
    JSON_OBJECT('user_id', users.id, 'username', users.username) AS user,
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
    JOIN addresses
    ON housing_companies.address_id = addresses.id
    JOIN streets
    ON addresses.street_id = streets.id
    JOIN postcodes
    ON streets.postcode_id = postcodes.id
    WHERE postcodes.id = ? AND users.id = ?;`;
  let params = [postcodeID, userID];
  if (role === 'admin') {
    sql = `SELECT answers.id, question_id, answer, survey_id, questions.section_id, questions.question_category_id,
    JSON_OBJECT('question', questions.question, 'weight', questions.weight, 'weight', questions.weight) AS question,
    JSON_OBJECT('survey_id', surveys.id, 'start_date', surveys.start_date, 'end_date', surveys.end_date, 'min_responses', surveys.min_responses, 'max_responses', surveys.max_responses, 'survey_status', surveys.survey_status, 'user_id', surveys.user_id, 'survey_key', surveys.survey_key, 'housing_company_id', surveys.housing_company_id) AS survey,
    JSON_OBJECT('user_id', users.id, 'username', users.username) AS user,
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
    JOIN addresses
    ON housing_companies.address_id = addresses.id
    JOIN streets
    ON addresses.street_id = streets.id
    JOIN postcodes
    ON streets.postcode_id = postcodes.id
    WHERE postcodes.id = ?;`;
    params = [postcodeID];
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
  // return rows;
};

const getAnswersByCity = async (
  userID: number,
  role: string,
  city: string
): Promise<Answer[]> => {
  let sql = `SELECT answers.id, question_id, answer, survey_id, questions.section_id, questions.question_category_id,
    JSON_OBJECT('question', questions.question, 'weight', questions.weight, 'weight', questions.weight) AS question,
    JSON_OBJECT('survey_id', surveys.id, 'start_date', surveys.start_date, 'end_date', surveys.end_date, 'min_responses', surveys.min_responses, 'max_responses', surveys.max_responses, 'survey_status', surveys.survey_status, 'user_id', surveys.user_id, 'survey_key', surveys.survey_key, 'housing_company_id', surveys.housing_company_id) AS survey,
    JSON_OBJECT('user_id', users.id, 'username', users.username) AS user,
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
    JOIN addresses
    ON housing_companies.address_id = addresses.id
    JOIN streets
    ON addresses.street_id = streets.id
    JOIN postcodes
    ON streets.postcode_id = postcodes.id
    JOIN cities
    ON postcodes.city_id = cities.id
    WHERE cities.name = ? AND users.id = ?;`;
  let params = [city, userID];
  if (role === 'admin') {
    sql = `SELECT answers.id, question_id, answer, survey_id, questions.section_id, questions.question_category_id,
    JSON_OBJECT('question', questions.question, 'weight', questions.weight, 'weight', questions.weight) AS question,
    JSON_OBJECT('survey_id', surveys.id, 'start_date', surveys.start_date, 'end_date', surveys.end_date, 'min_responses', surveys.min_responses, 'max_responses', surveys.max_responses, 'survey_status', surveys.survey_status, 'user_id', surveys.user_id, 'survey_key', surveys.survey_key, 'housing_company_id', surveys.housing_company_id) AS survey,
    JSON_OBJECT('user_id', users.id, 'username', users.username) AS user,
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
    JOIN addresses
    ON housing_companies.address_id = addresses.id
    JOIN streets
    ON addresses.street_id = streets.id
    JOIN postcodes
    ON streets.postcode_id = postcodes.id
    JOIN cities
    ON postcodes.city_id = cities.id
    WHERE cities.name = ?;`;
    params = [city];
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
  // return rows;
};

const getThreeBestAnswerScoresBySurvey = async (surveyId: number) => {
  const [rows] = await promisePool.execute<GetAnswer[]>(
    `SELECT question_id, question_order, SUM(answer) AS answer_sum, questions.question
    FROM answers
    JOIN questions
    ON answers.question_id = questions.id
    WHERE survey_id = ?
    GROUP BY question_id
    ORDER BY SUM(answer) DESC
    LIMIT 3;`,
    [surveyId]
  );
  if (rows.length === 0) {
    throw new CustomError('No answers found', 404);
  }
  return rows;
};

const getThreeWorstAnswerScoresBySurvey = async (surveyId: number) => {
  const [rows] = await promisePool.execute<GetAnswer[]>(
    `SELECT question_id, question_order, SUM(answer) AS answer_sum, questions.question
    FROM answers
    JOIN questions
    ON answers.question_id = questions.id
    WHERE survey_id = ?
    GROUP BY question_id
    ORDER BY SUM(answer)
    LIMIT 3;`,
    [surveyId]
  );
  if (rows.length === 0) {
    throw new CustomError('No answers found', 404);
  }
  return rows;
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
  WHERE survey_id = ? AND users.id = ?`;
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
  checkAnswersBySurvey,
  getAnswersByPostcodeId,
  getAnswersByCity,
  getThreeBestAnswerScoresBySurvey,
  getThreeWorstAnswerScoresBySurvey,
  postAnswer,
  putAnswer,
  deleteAnswer,
  deleteAllAnswersBySurvey
};
