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

const getAllSurveys = async (): Promise<Survey[]> => {
  const [rows] = await promisePool.execute<GetSurvey[]>(
    `SELECT surveys.id, start_date, end_date, min_responses, max_responses, survey_status, surveys.user_id, survey_key, surveys.housing_company_id,
    JSON_OBJECT('user_id', users.id, 'user_name', users.user_name) AS user,
    JSON_OBJECT('housing_company_id', housing_companies.id, 'name', housing_companies.name) AS housing_company
    FROM surveys
    JOIN users
    ON surveys.user_id = users.id
    JOIN housing_companies
    ON surveys.housing_company_id = housing_companies.id
    `
  );
  if (rows.length === 0) {
    throw new CustomError('No surveys found', 404);
  }
  return rows;
};

const getSurvey = async (id: number): Promise<Survey> => {
  const [rows] = await promisePool.execute<GetSurvey[]>(
    `SELECT surveys.id, start_date, end_date, min_responses, max_responses, survey_status, surveys.user_id, survey_key, surveys.housing_company_id,
    JSON_OBJECT('user_id', users.id, 'user_name', users.user_name) AS user,
    JSON_OBJECT('housing_company_id', housing_companies.id, 'name', housing_companies.name) AS housing_company
    FROM surveys
    JOIN users
    ON surveys.user_id = users.id
    JOIN housing_companies
    ON surveys.housing_company_id = housing_companies.id
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
    `SELECT surveys.id, start_date, end_date, min_responses, max_responses, survey_status, surveys.user_id, survey_key, surveys.housing_company_id,
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
    throw new CustomError('Survey not found', 404);
  }
  return rows[0];
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
  let sql = `SELECT surveys.id, start_date, end_date, min_responses, max_responses, survey_status, surveys.user_id, survey_key, surveys.housing_company_id,
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
    sql = `SELECT surveys.id, start_date, end_date, min_responses, max_responses, survey_status, surveys.user_id, survey_key, surveys.housing_company_id,
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
  console.log(surveys);
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
  checkIfSurveyBelongsToUser
};
