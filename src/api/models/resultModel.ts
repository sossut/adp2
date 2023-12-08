import { promisePool } from '../../database/db';
import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';
import {
  GetResult,
  PostResult,
  PutResult,
  Result
} from '../../interfaces/Result';

const getAllResults = async (
  userID: number,
  role: string
): Promise<Result[]> => {
  let sql = `SELECT results.id, results.date_time, filename, results.survey_id, results.result_summary_id, answer_count,
  JSON_OBJECT('survey_id', surveys.id, 'date_time', surveys.date_time, 'start_date', surveys.start_date, 'end_date', surveys.end_date, 'min_responses', surveys.min_responses, 'max_responses', surveys.max_responses, 'survey_status', surveys.survey_status, 'user_id', surveys.user_id, 'survey_key', surveys.survey_key, 'housing_company_id', surveys.housing_company_id) AS survey,
  JSON_OBJECT('housing_company_id', housing_companies.id, 'name', housing_companies.name, 'street', streets.name, 'street_number', addresses.number, 'postcode', postcodes.code, 'city', cities.name, 'location', location) AS housing_company,
  JSON_OBJECT('result_summary_id', result_summaries.id, 'summary', summary, 'recommendation', recommendation, 'section_one', section_one, 'section_two', section_two, 'section_three', section_three) AS result_summary
  FROM results
  JOIN surveys
  ON results.survey_id = surveys.id
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
  JOIN result_summaries
  ON results.result_summary_id = result_summaries.id
  WHERE housing_companies.user_id = ?;`;
  let params = [userID];
  if (role === 'admin') {
    sql = `SELECT results.id, results.date_time, filename, results.survey_id, results.result_summary_id, answer_count,
  JSON_OBJECT('survey_id', surveys.id, 'date_time', surveys.date_time, 'start_date', surveys.start_date, 'end_date', surveys.end_date, 'min_responses', surveys.min_responses, 'max_responses', surveys.max_responses, 'survey_status', surveys.survey_status, 'user_id', surveys.user_id, 'survey_key', surveys.survey_key, 'housing_company_id', surveys.housing_company_id) AS survey,
  JSON_OBJECT('housing_company_id', housing_companies.id, 'name', housing_companies.name, 'street', streets.name, 'street_number', addresses.number, 'postcode', postcodes.code, 'city', cities.name, 'location', location) AS housing_company,
  JSON_OBJECT('result_summary_id', result_summaries.id, 'summary', summary, 'recommendation', recommendation, 'section_one', section_one, 'section_two', section_two, 'section_three', section_three) AS result_summary
  FROM results
  JOIN surveys
  ON results.survey_id = surveys.id
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
  JOIN result_summaries
  ON results.result_summary_id = result_summaries.id`;
    params = [];
  }

  const format = promisePool.format(sql, params);

  const [rows] = await promisePool.execute<GetResult[]>(format);
  if (rows.length === 0) {
    throw new CustomError('No results found', 404);
  }
  // const results: Result[] = rows.map((row) => ({
  //   ...row,
  //   survey: JSON.parse(row.survey?.toString() || '{}'),
  //   housing_company: JSON.parse(row.housing_company?.toString() || '{}')
  // }));
  // return results;
  return rows;
};

const getResult = async (
  id: string,
  userId: number,
  role: string
): Promise<GetResult> => {
  let sql = `SELECT results.id, results.date_time, filename, results.survey_id, results.result_summary_id, answer_count,
  JSON_OBJECT('survey_id', surveys.id, 'date_time', surveys.date_time, 'start_date', surveys.start_date, 'end_date', surveys.end_date, 'min_responses', surveys.min_responses, 'max_responses', surveys.max_responses, 'survey_status', surveys.survey_status, 'user_id', surveys.user_id, 'survey_key', surveys.survey_key, 'housing_company_id', surveys.housing_company_id) AS survey,
  JSON_OBJECT('housing_company_id', housing_companies.id, 'name', housing_companies.name, 'street', streets.name, 'street_number', addresses.number, 'postcode', postcodes.code, 'city', cities.name, 'location', location) AS housing_company,
  JSON_OBJECT('result_summary_id', result_summaries.id, 'summary', summary, 'recommendation', recommendation, 'section_one', section_one, 'section_two', section_two, 'section_three', section_three) AS result_summary
  FROM results
  JOIN surveys
  ON results.survey_id = surveys.id
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
  JOIN result_summaries
  ON results.result_summary_id = result_summaries.id
  WHERE results.id = ? AND surveys.user_id = ?;`;
  let params = [id, userId];
  if (role === 'admin') {
    sql = `SELECT results.id, results.date_time, filename, results.survey_id, results.result_summary_id, answer_count,
    JSON_OBJECT('survey_id', surveys.id, 'start_date', surveys.start_date, 'end_date', surveys.end_date, 'min_responses', surveys.min_responses, 'max_responses', surveys.max_responses, 'survey_status', surveys.survey_status, 'user_id', surveys.user_id, 'survey_key', surveys.survey_key, 'housing_company_id', surveys.housing_company_id) AS survey,
    JSON_OBJECT('housing_company_id', housing_companies.id, 'name', housing_companies.name, 'street', streets.name, 'street_number', addresses.number, 'postcode', postcodes.code, 'city', cities.name, 'location', location) AS housing_company,
    JSON_OBJECT('result_summary_id', result_summaries.id, 'summary', summary, 'recommendation', recommendation, 'section_one', section_one, 'section_two', section_two, 'section_three', section_three) AS result_summary
    FROM results
    JOIN surveys
    ON results.survey_id = surveys.id
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
    JOIN result_summaries
    ON results.result_summary_id = result_summaries.id
    WHERE results.id = ?;`;
    params = [id];
  }
  const format = promisePool.format(sql, params);

  const [rows] = await promisePool.execute<GetResult[]>(format);
  if (rows.length === 0) {
    throw new CustomError('Result not found', 404);
  }
  return rows[0];
};

const getResultBySurveyId = async (
  surveyId: number,
  userId: number,
  role: string
) => {
  let sql = `SELECT results.id, results.date_time, filename, results.survey_id, results.result_summary_id, answer_count,
  JSON_OBJECT('survey_id', surveys.id, 'date_time', surveys.date_time, 'start_date', surveys.start_date, 'end_date', surveys.end_date, 'min_responses', surveys.min_responses, 'max_responses', surveys.max_responses, 'survey_status', surveys.survey_status, 'user_id', surveys.user_id, 'survey_key', surveys.survey_key, 'housing_company_id', surveys.housing_company_id) AS survey,
  JSON_OBJECT('housing_company_id', housing_companies.id, 'name', housing_companies.name, 'street', streets.name, 'street_number', addresses.number, 'postcode', postcodes.code, 'city', cities.name, 'location', location) AS housing_company,
  JSON_OBJECT('result_summary_id', result_summaries.id, 'summary', summary, 'recommendation', recommendation, 'section_one', section_one, 'section_two', section_two, 'section_three', section_three) AS result_summary
  FROM results
  JOIN surveys
  ON results.survey_id = surveys.id
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
  JOIN result_summaries
  ON results.result_summary_id = result_summaries.id
  WHERE results.survey_id = ? AND surveys.user_id = ?;`;
  let params = [surveyId, userId];
  if (role === 'admin') {
    sql = `SELECT results.id, results.date_time, filename, results.survey_id, results.result_summary_id, answer_count,
    JSON_OBJECT('survey_id', surveys.id, 'start_date', surveys.start_date, 'end_date', surveys.end_date, 'min_responses', surveys.min_responses, 'max_responses', surveys.max_responses, 'survey_status', surveys.survey_status, 'user_id', surveys.user_id, 'survey_key', surveys.survey_key, 'housing_company_id', surveys.housing_company_id) AS survey,
    JSON_OBJECT('housing_company_id', housing_companies.id, 'name', housing_companies.name, 'street', streets.name, 'street_number', addresses.number, 'postcode', postcodes.code, 'city', cities.name, 'location', location) AS housing_company,
    JSON_OBJECT('result_summary_id', result_summaries.id, 'summary', summary, 'recommendation', recommendation, 'section_one', section_one, 'section_two', section_two, 'section_three', section_three) AS result_summary
    FROM results
    JOIN surveys
    ON results.survey_id = surveys.id
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
    JOIN result_summaries
    ON results.result_summary_id = result_summaries.id
    WHERE results.survey_id = ?;`;
    params = [surveyId];
  }
  const format = promisePool.format(sql, params);

  const [rows] = await promisePool.execute<GetResult[]>(format);
  if (rows.length === 0) {
    throw new CustomError('Result not found', 404);
  }
  return rows[0];
};

const getResultResultSummary = async (
  resultSummaryId: number
): Promise<GetResult> => {
  const [rows] = await promisePool.execute<GetResult[]>(
    `SELECT result_summary_id
    FROM results
    WHERE results.result_summary_id = ?;`,
    [resultSummaryId]
  );
  if (rows.length === 0) {
    throw new CustomError('Result not found', 404);
  }
  return rows[0];
};

const getResultAnswerCount = async (surveyId: number): Promise<number> => {
  const [rows] = await promisePool.execute<GetResult[]>(
    `SELECT answer_count
    FROM results
    WHERE results.survey_id = ?;`,
    [surveyId]
  );
  if (rows.length === 0) {
    throw new CustomError('Result not found', 404);
  }
  return rows[0].answer_count;
};

const postResult = async (result: PostResult) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `INSERT INTO results (date_time, filename, survey_id, answer_count, result_summary_id)
    VALUES (?, ?, ?, ?, ?)`,
    [
      result.date_time,
      result.filename,
      result.survey_id,
      result.answer_count,
      result.result_summary_id
    ]
  );
  return headers.insertId;
};

const putResult = async (
  data: PutResult,
  id: number,
  userID: number,
  role: string
): Promise<boolean> => {
  let sql = `UPDATE results 
  JOIN surveys
  ON results.survey_id = surveys.id
  SET ?
  WHERE results.id = ? AND surveys.user_id = ?;`;
  let params = [data, id, userID];
  if (role === 'admin') {
    sql = 'UPDATE results SET ? WHERE id = ?;';
    params = [data, id];
  }
  const format = promisePool.format(sql, params);

  const [headers] = await promisePool.query<ResultSetHeader>(format);
  if (headers.affectedRows === 0) {
    throw new CustomError('Result not updated', 404);
  }
  return true;
};

const changeResultSummary = async (
  resultSummaryID: number,
  survey_id: number
): Promise<boolean> => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `UPDATE results
    SET result_summary_id = ?
    WHERE survey_id = ?;`,
    [resultSummaryID, survey_id]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Result not updated', 404);
  }
  return true;
};

const addAnswerCount = async (surveyId: number): Promise<boolean> => {
  let sql = `UPDATE results 
  JOIN surveys
  ON results.survey_id = surveys.id
  SET answer_count = answer_count + 1
  WHERE results.survey_id = ?`;
  let params = [surveyId];

  const format = promisePool.format(sql, params);

  const [headers] = await promisePool.query<ResultSetHeader>(format);
  if (headers.affectedRows === 0) {
    throw new CustomError('Result not updated', 404);
  }
  return true;
};

const deleteResult = async (
  id: number,
  userID: number,
  role: string
): Promise<boolean> => {
  let sql = `DELETE results FROM results
  JOIN surveys
  ON results.survey_id = surveys.id
  WHERE results.id = ? AND surveys.user_id = ?;`;
  let params = [id, userID];
  if (role === 'admin') {
    sql = 'DELETE FROM results WHERE id = ?;';
    params = [id];
  }
  const format = promisePool.format(sql, params);
  const [headers] = await promisePool.query<ResultSetHeader>(format);
  if (headers.affectedRows === 0) {
    throw new CustomError('Result not deleted', 404);
  }
  return true;
};

const deleteResultBySurvey = async (
  surveyID: number,
  userID: number,
  role: string
): Promise<boolean> => {
  let sql = `DELETE results FROM results
  JOIN surveys
  ON results.survey_id = surveys.id
  WHERE survey_id = ? AND surveys.user_id = ?;`;
  let params = [surveyID, userID];
  if (role === 'admin') {
    sql = 'DELETE FROM results WHERE survey_id = ?;';
    params = [surveyID];
  }
  const format = promisePool.format(sql, params);
  const [headers] = await promisePool.query<ResultSetHeader>(format);
  if (headers.affectedRows === 0) {
    throw new CustomError('Results not deleted', 404);
  }
  return true;
};

export {
  getAllResults,
  getResult,
  getResultAnswerCount,
  getResultResultSummary,
  getResultBySurveyId,
  postResult,
  putResult,
  addAnswerCount,
  changeResultSummary,
  deleteResult,
  deleteResultBySurvey
};
