import { ResultSetHeader } from 'mysql2';
import { promisePool } from '../../database/db';

import CustomError from '../../classes/CustomError';

import {
  QuestionnaireSection,
  GetQuestionnaireSection,
  PostQuestionnaireSection,
  PutQuestionnaireSection
} from '../../interfaces/QuestionnaireSection';

const getAllQuestionnaireSections = async (): Promise<
  QuestionnaireSection[]
> => {
  const [rows] = await promisePool.execute<GetQuestionnaireSection[]>(
    'SELECT * FROM questionnaires_sections;'
  );
  if (rows.length === 0) {
    throw new CustomError('No questionnaires_sections found', 404);
  }
  return rows;
};

const getQuestionnaireSection = async (
  id: string
): Promise<GetQuestionnaireSection> => {
  const [rows] = await promisePool.execute<GetQuestionnaireSection[]>(
    `SELECT * 
    FROM questionnaires_sections WHERE id = ?;`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('No questionnaires_sections found', 404);
  }
  return rows[0];
};

const postQuestionnaireQuestion = async (
  questionnaireSection: PostQuestionnaireSection
): Promise<ResultSetHeader> => {
  const [rows] = await promisePool.execute<ResultSetHeader>(
    `INSERT INTO questionnaires_sections (questionnaire_id, section_id)
    VALUES (?, ?);`,
    [questionnaireSection.questionnaire_id, questionnaireSection.section_id]
  );
  return rows;
};

const putQuestionnaireSection = async (
  id: number,
  questionnaireSection: PutQuestionnaireSection
): Promise<ResultSetHeader> => {
  const sql = promisePool.format(
    'UPDATE questionnaires_sections SET ? WHERE id = ?;',
    [questionnaireSection, id]
  );
  const [rows] = await promisePool.execute<ResultSetHeader>(sql);
  return rows;
};

const deleteQuestionnaireSection = async (
  id: number
): Promise<ResultSetHeader> => {
  const [rows] = await promisePool.execute<ResultSetHeader>(
    'DELETE FROM questionnaires_sections WHERE id = ?;',
    [id]
  );
  return rows;
};

export {
  getAllQuestionnaireSections,
  getQuestionnaireSection,
  postQuestionnaireQuestion,
  putQuestionnaireSection,
  deleteQuestionnaireSection
};
