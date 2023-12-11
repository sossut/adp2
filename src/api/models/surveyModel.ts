import { promisePool } from '../../database/db';
import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';

import {
  GetSurvey,
  PostSurvey,
  PutSurvey,
  Survey
} from '../../interfaces/Survey';
import { deleteAllAnswersBySurvey } from './answerModel';
import { deleteResultBySurvey } from './resultModel';
import { getSurveyResultsAndCount } from '../../utils/utility';

const getAllSurveys = async (
  userId: number,
  role: string
): Promise<Survey[]> => {
  let sql = `SELECT surveys.id, start_date, end_date, min_responses, max_responses, survey_status, surveys.user_id, survey_key, surveys.housing_company_id, surveys.date_time,
    JSON_OBJECT('user_id', users.id, 'user_name', users.user_name) AS user,
    JSON_OBJECT('result_id', results.id, 'answer_count', answer_count, 'result_summary_id', result_summary_id) AS result,
    JSON_OBJECT('housing_company_id', housing_companies.id, 'name', housing_companies.name) AS housing_company,
    JSON_OBJECT('address_id', addresses.id, 'number', addresses.number) AS address,
    JSON_OBJECT('street_id', streets.id, 'name', streets.name) AS street,
    JSON_OBJECT('postcode_id', postcodes.id, 'code', postcodes.code, 'name', postcodes.name) AS postcode,
    JSON_OBJECT('city_id', cities.id, 'name', cities.name) AS city
    FROM surveys
    JOIN users
    ON surveys.user_id = users.id
    JOIN results
    ON results.survey_id = surveys.id
    JOIN housing_companies
    ON housing_company_id = housing_companies.id
    JOIN addresses
    ON housing_companies.address_id = addresses.id
    JOIN streets
    ON addresses.street_id = streets.id
    JOIN postcodes
    ON streets.postcode_id = postcodes.id
    JOIN cities
    ON postcodes.city_id = cities.id
    WHERE users.id = ?
    ;`;
  let params = [userId];
  if (role === 'admin') {
    sql = `SELECT surveys.id, start_date, end_date, min_responses, max_responses, survey_status, surveys.user_id, survey_key, surveys.housing_company_id, surveys.date_time,
    JSON_OBJECT('user_id', users.id, 'user_name', users.user_name) AS user,
    JSON_OBJECT('result_id', results.id, 'answer_count', answer_count, 'result_summary_id', result_summary_id) AS result,
    JSON_OBJECT('housing_company_id', housing_companies.id, 'name', housing_companies.name) AS housing_company,
    JSON_OBJECT('address_id', addresses.id, 'number', addresses.number) AS address,
    JSON_OBJECT('street_id', streets.id, 'name', streets.name) AS street,
    JSON_OBJECT('postcode_id', postcodes.id, 'code', postcodes.code, 'name', postcodes.name) AS postcode,
    JSON_OBJECT('city_id', cities.id, 'name', cities.name) AS city
    FROM surveys
    JOIN users
    ON surveys.user_id = users.id
    JOIN results
    ON results.survey_id = surveys.id
    JOIN housing_companies
    ON housing_company_id = housing_companies.id
    JOIN addresses
    ON housing_companies.address_id = addresses.id
    JOIN streets
    ON addresses.street_id = streets.id
    JOIN postcodes
    ON streets.postcode_id = postcodes.id
    JOIN cities
    ON postcodes.city_id = cities.id;`;
    params = [];
  }
  const format = promisePool.format(sql, params);
  const [rows] = await promisePool.execute<GetSurvey[]>(format);
  if (rows.length === 0) {
    throw new CustomError('No surveys found', 404);
  }
  return rows;
};

const getSurvey = async (id: number): Promise<Survey> => {
  const [rows] = await promisePool.execute<GetSurvey[]>(
    `SELECT surveys.id, start_date, end_date, min_responses, max_responses, survey_status, surveys.user_id, survey_key, surveys.housing_company_id, surveys.date_time,
    JSON_OBJECT('user_id', users.id, 'user_name', users.user_name) AS user,
    JSON_OBJECT('result_id', results.id, 'answer_count', answer_count, 'result_summary_id', result_summary_id) AS result,
    JSON_OBJECT('housing_company_id', housing_companies.id, 'name', housing_companies.name) AS housing_company,
    JSON_OBJECT('address_id', addresses.id, 'number', addresses.number) AS address,
    JSON_OBJECT('street_id', streets.id, 'name', streets.name) AS street,
    JSON_OBJECT('postcode_id', postcodes.id, 'code', postcodes.code, 'name', postcodes.name) AS postcode,
    JSON_OBJECT('city_id', cities.id, 'name', cities.name) AS city
    FROM surveys
    JOIN users
    ON surveys.user_id = users.id
    JOIN results
    ON results.survey_id = surveys.id
    JOIN housing_companies
    ON housing_company_id = housing_companies.id
    JOIN addresses
    ON housing_companies.address_id = addresses.id
    JOIN streets
    ON addresses.street_id = streets.id
    JOIN postcodes
    ON streets.postcode_id = postcodes.id
    JOIN cities
    ON postcodes.city_id = cities.id
    WHERE surveys.id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('Survey not found', 404);
  }
  return rows[0];
};

const postSurvey = async (survey: PostSurvey) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `INSERT INTO surveys (start_date, end_date, min_responses, max_responses, survey_status, user_id, survey_key, housing_company_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      survey.start_date,
      survey.end_date,
      survey.min_responses,
      survey.max_responses,
      survey.survey_status,
      survey.user_id,
      survey.survey_key,
      survey.housing_company_id
    ]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Survey not created', 400);
  }
  return headers.insertId;
};

const putSurvey = async (
  data: PutSurvey,
  id: number,
  userID: number,
  role: string
): Promise<boolean> => {
  let sql = 'UPDATE surveys SET ? WHERE id = ? AND user_id = ?;';
  let params = [data, id, userID];
  if (role === 'admin') {
    sql = 'UPDATE surveys SET ? WHERE id = ?;';
    params = [data, id];
  }
  const format = promisePool.format(sql, params);

  const [headers] = await promisePool.query<ResultSetHeader>(format);
  if (headers.affectedRows === 0) {
    throw new CustomError('Survey not updated', 404);
  }
  return true;
};

const getSurveyByKey = async (key: string): Promise<Survey> => {
  const [rows] = await promisePool.execute<GetSurvey[]>(
    `SELECT surveys.id, start_date, end_date, min_responses, max_responses, survey_status, surveys.user_id, survey_key, surveys.housing_company_id, date_time,
    JSON_OBJECT('user_id', users.id, 'user_name', users.user_name) AS user,
    JSON_OBJECT('housing_company_id', housing_companies.id, 'name', housing_companies.name) AS housing_company,
    JSON_OBJECT('address_id', addresses.id, 'number', addresses.number) AS address,
    JSON_OBJECT('street_id', streets.id, 'name', streets.name) AS street,
    JSON_OBJECT('postcode_id', postcodes.id, 'code', postcodes.code, 'name', postcodes.name) AS postcode,
    JSON_OBJECT('city_id', cities.id, 'name', cities.name) AS city
    FROM surveys
    JOIN users
    ON surveys.user_id = users.id
    JOIN housing_companies
    ON housing_company_id = housing_companies.id
    JOIN addresses
    ON housing_companies.address_id = addresses.id
    JOIN streets
    ON addresses.street_id = streets.id
    JOIN postcodes
    ON streets.postcode_id = postcodes.id
    JOIN cities
    ON postcodes.city_id = cities.id
    WHERE survey_key = ?`,
    [key]
  );
  if (rows.length === 0) {
    throw new CustomError('Survey not found', 404);
  }
  return rows[0];
};

const checkIfSurveyKeyExists = async (key: string): Promise<boolean> => {
  const [rows] = await promisePool.execute<GetSurvey[]>(
    `SELECT surveys.id, start_date, end_date, min_responses, max_responses, survey_status, surveys.user_id, survey_key, surveys.housing_company_id, date_time,
    JSON_OBJECT('user_id', users.id, 'user_name', users.user_name) AS user,
    JSON_OBJECT('housing_company_id', housing_companies.id, 'name', housing_companies.name) AS housing_company
    FROM surveys
    JOIN users
    ON surveys.user_id = users.id
    JOIN housing_companies
    ON housing_company_id = housing_companies.id
    WHERE survey_key = ?`,
    [key]
  );
  if (rows.length === 0) {
    return false;
  }
  return true;
};

const checkIfSurveyBelongsToUser = async (
  surveyID: number,
  userID: number
): Promise<boolean> => {
  const [rows] = await promisePool.execute<GetSurvey[]>(
    `SELECT user_id FROM surveys
    WHERE id = ?;`,
    [surveyID]
  );
  if (rows.length === 0) {
    throw new CustomError('Survey not found', 404);
  }
  if (rows[0].user_id === userID) {
    return true;
  } else {
    return false;
  }
};

const getSurveysByHousingCompany = async (
  housingCompanyID: number,
  userID: number,
  role: string
): Promise<Survey[]> => {
  let sql = `SELECT surveys.id, start_date, end_date, min_responses, max_responses, survey_status, surveys.user_id, survey_key, surveys.housing_company_id, date_time,
      JSON_OBJECT('user_id', users.id, 'user_name', users.user_name) AS user,
      JSON_OBJECT('housing_company_id', housing_companies.id, 'name', housing_companies.name) AS housing_company
      FROM surveys
      JOIN users
      ON surveys.user_id = users.id
      JOIN housing_companies
      ON surveys.housing_company_id = housing_companies.id
      WHERE housing_company_id = ? AND surveys.user_id = ?
      ;`;
  let params = [housingCompanyID, userID];
  if (role === 'admin') {
    sql = `SELECT surveys.id, start_date, end_date, min_responses, max_responses, survey_status, surveys.user_id, survey_key, surveys.housing_company_id, date_time
        JSON_OBJECT('user_id', users.id, 'user_name', users.user_name) AS user,
        JSON_OBJECT('housing_company_id', housing_companies.id, 'name', housing_companies.name) AS housing_company
        FROM surveys
        JOIN users
        ON surveys.user_id = users.id
        JOIN housing_companies
        ON surveys.housing_company_id = housing_companies.id
        WHERE housing_company_id = ?
        ;`;
    params = [housingCompanyID];
  }
  const format = promisePool.format(sql, params);
  const [rows] = await promisePool.execute<GetSurvey[]>(format);
  if (rows.length === 0) {
    throw new CustomError('No surveys found', 404);
  }
  return rows;
};

const getSurveysByHousingCompanyByTime = async (
  housingCompanyID: number,
  userID: number,
  role: string
): Promise<Survey[]> => {
  let sql = `SELECT surveys.id, start_date, end_date, min_responses, max_responses, survey_status, surveys.user_id, survey_key, surveys.housing_company_id, date_time,
      JSON_OBJECT('user_id', users.id, 'user_name', users.user_name) AS user,
      JSON_OBJECT('housing_company_id', housing_companies.id, 'name', housing_companies.name) AS housing_company
      FROM surveys
      JOIN users
      ON surveys.user_id = users.id
      JOIN housing_companies
      ON surveys.housing_company_id = housing_companies.id
      WHERE housing_company_id = ? AND surveys.user_id = ?
      ORDER BY date_time DESC
      ;`;
  let params = [housingCompanyID, userID];
  if (role === 'admin') {
    sql = `SELECT surveys.id, start_date, end_date, min_responses, max_responses, survey_status, surveys.user_id, survey_key, surveys.housing_company_id, date_time,
        JSON_OBJECT('user_id', users.id, 'user_name', users.user_name) AS user,
        JSON_OBJECT('housing_company_id', housing_companies.id, 'name', housing_companies.name) AS housing_company
        FROM surveys
        JOIN users
        ON surveys.user_id = users.id
        JOIN housing_companies
        ON surveys.housing_company_id = housing_companies.id
        WHERE housing_company_id = ?
        ORDER BY date_time DESC
        ;`;
    params = [housingCompanyID];
  }
  const format = promisePool.format(sql, params);
  const [rows] = await promisePool.execute<GetSurvey[]>(format);
  if (rows.length === 0) {
    throw new CustomError('No surveys found', 404);
  }
  await Promise.all(
    rows.map(async (survey) => {
      const result = await getSurveyResultsAndCount(survey.id);
      survey.result = result;
    })
  );

  return rows;
};

const deleteSurvey = async (
  id: number,
  userID: number,
  role: string
): Promise<boolean> => {
  let sql = 'DELETE FROM surveys WHERE id = ? AND user_id = ?;';
  let params = [id, userID];
  if (role === 'admin') {
    sql = 'DELETE FROM surveys WHERE id = ?;';
    params = [id];
  }
  const format = promisePool.format(sql, params);
  const [headers] = await promisePool.query<ResultSetHeader>(format);
  if (headers.affectedRows === 0) {
    throw new CustomError('Survey not deleted', 404);
  }
  return true;
};

const deleteAllSurveysFromHousingCompany = async (
  housingCompanyID: number,
  userID: number,
  role: string
): Promise<boolean> => {
  const surveys: Array<Survey> = await getSurveysByHousingCompany(
    housingCompanyID,
    userID,
    role
  );

  for (const survey of surveys) {
    await deleteResultBySurvey(survey.id, userID, role);
    await deleteAllAnswersBySurvey(survey.id, userID, role);
  }
  let sql = 'DELETE FROM surveys WHERE housing_company_id = ? AND user_id = ?;';
  let params = [housingCompanyID, userID];
  if (role === 'admin') {
    sql = 'DELETE FROM surveys WHERE housing_company_id = ?;';
    params = [housingCompanyID];
  }
  const format = promisePool.format(sql, params);
  const [headers] = await promisePool.query<ResultSetHeader>(format);
  if (headers.affectedRows === 0) {
    throw new CustomError('Surveys not deleted', 404);
  }
  return true;
};
export {
  getAllSurveys,
  getSurvey,
  postSurvey,
  putSurvey,
  deleteSurvey,
  deleteAllSurveysFromHousingCompany,
  getSurveyByKey,
  getSurveysByHousingCompany,
  getSurveysByHousingCompanyByTime,
  checkIfSurveyBelongsToUser,
  checkIfSurveyKeyExists
};
