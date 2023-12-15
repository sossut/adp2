import { ResultSetHeader } from 'mysql2';
import { promisePool } from '../../database/db';

import CustomError from '../../classes/CustomError';

import {
  SectionsUsedInSurvey,
  GetSectionsUsedInSurvey,
  PostSectionsUsedInSurvey,
  PutSectionsUsedInSurvey
} from '../../interfaces/SectionsUsedInSurvey';

const getAllSectionsUsedInSurveys = async (): Promise<
  SectionsUsedInSurvey[]
> => {
  const [rows] = await promisePool.execute<GetSectionsUsedInSurvey[]>(
    `SELECT sections_used_in_survey.id, sections_used_in_survey.sections_used,
    JSON_OBJECT('id', sections.id, 'section_text', section_text, 'active', active, 'description', description) AS section,
    JSON_OBJECT('id', surveys.id, 'housing_company_id', surveys.housing_company_id) AS survey
    FROM sections_used_in_survey
    JOIN sections
    ON sections_used_in_survey.section_id = sections.id
    JOIN surveys
    ON sections_used_in_survey.survey_id = surveys.id;`
  );
  if (rows.length === 0) {
    throw new CustomError('No sections used in surveys found', 404);
  }
  const sectionsUsedInSurveys: SectionsUsedInSurvey[] = rows.map((row) => ({
    ...row,
    section: JSON.parse(row.section?.toString() || '{}'),
    survey: JSON.parse(row.survey?.toString() || '{}')
  }));
  return sectionsUsedInSurveys;
  // return rows;
};

const getSectionsUsedInSurvey = async (
  id: number
): Promise<SectionsUsedInSurvey> => {
  const [rows] = await promisePool.execute<GetSectionsUsedInSurvey[]>(
    `SELECT sections_used_in_surveys.id, sections_used_in_survey.sections_used,
    JSON_OBJECT('id', sections.id, 'section_text', section_text, 'active', active, 'description', description) AS section,
    JSON_OBJECT('id', surveys.id, 'housing_company_id', surveys.housing_company_id) AS survey
    FROM sections_used_in_survey
    JOIN sections
    ON sections_used_in_survey.section_id = sections.id
    JOIN surveys
    ON sections_used_in_survey.survey_id = surveys.id;
    WHERE sections_used_in_surveys.id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('No sections used in surveys found', 404);
  }
  const sectionsUsedInSurveys: GetSectionsUsedInSurvey[] = rows.map((row) => ({
    ...row,
    section: JSON.parse(row.section?.toString() || '{}'),
    survey: JSON.parse(row.survey?.toString() || '{}')
  }));
  return sectionsUsedInSurveys[0];
  // return rows[0];
};

const getSectionsUsedInSurveyBySurveyId = async (
  survey_id: number
): Promise<SectionsUsedInSurvey> => {
  const [rows] = await promisePool.execute<GetSectionsUsedInSurvey[]>(
    `SELECT sections_used_in_survey.sections_used
    FROM sections_used_in_survey
    WHERE sections_used_in_survey.survey_id = ?;`,
    [survey_id]
  );
  if (rows.length === 0) {
    throw new CustomError('No sections used in surveys found', 404);
  }
  return rows[0];
};

const getSectionsUsedInSurveyBySurveyKey = async (
  survey_key: string
): Promise<SectionsUsedInSurvey> => {
  const [rows] = await promisePool.execute<GetSectionsUsedInSurvey[]>(
    `SELECT sections_used   
    FROM sections_used_in_survey
    JOIN surveys
    ON sections_used_in_survey.survey_id = surveys.id
    WHERE surveys.survey_key = ?`,
    [survey_key]
  );
  if (rows.length === 0) {
    throw new CustomError('No sections used in surveys found', 404);
  }
  return rows[0];
};

const postSectionsUsedInSurvey = async (
  sectionsUsedInSurvey: PostSectionsUsedInSurvey
) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    'INSERT INTO sections_used_in_survey (sections_used, survey_id) VALUES (?, ?)',
    [sectionsUsedInSurvey.sections_used, sectionsUsedInSurvey.survey_id]
  );
  return headers.insertId;
};

const putSectionsUsedInSurvey = async (
  id: string,
  sectionsUsedInSurvey: PutSectionsUsedInSurvey
) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    'UPDATE sections_used_in_survey SET sections_used = ? WHERE id = ?',
    [sectionsUsedInSurvey.sections_used, id]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Sections used in survey not found', 404);
  }
  return headers.warningStatus;
};

const deleteSectionsUsedInSurvey = async (id: string) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    'DELETE FROM sections_used_in_survey WHERE id = ?',
    [id]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Sections used in survey not found', 404);
  }
  return headers.warningStatus;
};

export {
  getAllSectionsUsedInSurveys,
  getSectionsUsedInSurvey,
  getSectionsUsedInSurveyBySurveyKey,
  getSectionsUsedInSurveyBySurveyId,
  postSectionsUsedInSurvey,
  putSectionsUsedInSurvey,
  deleteSectionsUsedInSurvey
};
