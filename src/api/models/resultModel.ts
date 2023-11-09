import { promisePool } from '../../database/db';
import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';
import {
  GetResult,
  PostResult,
  PutResult,
  Result
} from '../../interfaces/Result';

const getAllResults = async (): Promise<Result[]> => {
  const [rows] = await promisePool.execute<GetResult[]>(
    `SELECT results.id, date_time, filename, results.survey_id, 
    JSON_OBJECT('survey_id', surveys.id, 'start_date', surveys.start_date, 'end_date', surveys.end_date, 'min_responses', surveys.min_responses, 'max_responses', surveys.max_responses, 'survey_status', surveys.survey_status, 'user_id', surveys.user_id, 'survey_key', surveys.survey_key, 'housing_company_id', surveys.housing_company_id) AS survey,
    JSON_OBJECT('housing_company_id', housing_companies.id, 'name', housing_companies.name, 'street', streets.name, 'street_number', addresses.number, 'postcode', postcodes.code, 'city', cities.name) AS housing_company
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
    ON postcodes.city_id = cities.id;`
  );
  if (rows.length === 0) {
    throw new CustomError('No results found', 404);
  }
  const results: Result[] = rows.map((row) => ({
    ...row,
    survey: JSON.parse(row.survey?.toString() || '{}'),
    housing_company: JSON.parse(row.housing_company?.toString() || '{}')
  }));
  return results;
};

const getResult = async (id: string): Promise<GetResult> => {
  const [rows] = await promisePool.execute<GetResult[]>(
    `SELECT results.id, date_time, filename, results.survey_id, 
    JSON_OBJECT('survey_id', surveys.id, 'start_date', surveys.start_date, 'end_date', surveys.end_date, 'min_responses', surveys.min_responses, 'max_responses', surveys.max_responses, 'survey_status', surveys.survey_status, 'user_id', surveys.user_id, 'survey_key', surveys.survey_key, 'housing_company_id', surveys.housing_company_id) AS survey,
    JSON_OBJECT('housing_company_id', housing_companies.id, 'name', housing_companies.name, 'street', streets.name, 'street_number', addresses.number, 'postcode', postcodes.code, 'city', cities.name) AS housing_company
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
    WHERE results.id = ?;`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('Result not found', 404);
  }
  return rows[0];
};

const postResult = async (result: PostResult) => {
  console.log(result);
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `INSERT INTO results (date_time, filename, survey_id)
    VALUES (?, ?, ?)`,
    [result.date_time, result.filename, result.survey_id]
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
  postResult,
  putResult,
  deleteResult,
  deleteResultBySurvey
};
