import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { promisePool } from '../../database/db';
import CustomError from '../../classes/CustomError';

import {
  Questionnaire,
  GetQuestionnaire,
  PostQuestionnaire,
  PutQuestionnaire
} from '../../interfaces/Questionnaire';
import { GetSection } from '../../interfaces/Section';
import { GetQuestion } from '../../interfaces/Question';

const getAllQuestionnaires = async (): Promise<Questionnaire[]> => {
  const [questionnaires] = await promisePool.execute<GetQuestionnaire[]>(
    'SELECT * FROM questionnaires;'
  );

  for (const questionnaire of questionnaires) {
    const [sections] = await promisePool.execute<GetSection[]>(
      'SELECT sections.* FROM sections JOIN questionnaires_sections ON sections.id = questionnaires_sections.section_id WHERE questionnaires_sections.questionnaire_id = ?;',
      [questionnaire.id]
    );

    for (const section of sections) {
      const [questions] = await promisePool.execute<GetQuestion[]>(
        'SELECT * FROM questions WHERE section_id = ?;',
        [section.id]
      );

      for (const question of questions) {
        const [rows] = await promisePool.execute<RowDataPacket[]>(
          `SELECT
            JSON_OBJECT ('question_id', questions.id, 'question', questions.question, 'weight', questions.weight, 'question_order', questions.question_order, 'active', questions.active, 'section_id', questions.section_id) AS question,
            CONCAT('[', GROUP_CONCAT(JSON_OBJECT('choices_id', choices.id, 'choice_text', choices.choice_text, 'choice_value', choices.choice_value)), ']') AS choices
          FROM questions
            JOIN questions_choices
              ON questions.id = questions_choices.question_id
            JOIN choices
              ON questions_choices.choice_id = choices.id
          WHERE questions.id = ?
          GROUP BY questions.id;`,
          [question.id]
        );
        question.choices = JSON.parse(rows[0]?.choices || '[]');
      }

      section.questions = questions;
    }

    questionnaire.sections = sections;
  }
  if (questionnaires.length === 0) {
    throw new CustomError('No questionnaires found', 404);
  }
  return questionnaires;
};

const getQuestionnaire = async (id: string): Promise<Questionnaire> => {
  const [questionnaires] = await promisePool.execute<GetQuestionnaire[]>(
    'SELECT * FROM questionnaires WHERE questionnaires.id = ?;',
    [id]
  );

  for (const questionnaire of questionnaires) {
    const [sections] = await promisePool.execute<GetSection[]>(
      'SELECT sections.* FROM sections JOIN questionnaires_sections ON sections.id = questionnaires_sections.section_id WHERE questionnaires_sections.questionnaire_id = ?;',
      [questionnaire.id]
    );

    for (const section of sections) {
      const [questions] = await promisePool.execute<GetQuestion[]>(
        'SELECT * FROM questions WHERE section_id = ?;',
        [section.id]
      );

      for (const question of questions) {
        const [rows] = await promisePool.execute<RowDataPacket[]>(
          `SELECT
            JSON_OBJECT ('question_id', questions.id, 'question', questions.question, 'weight', questions.weight, 'question_order', questions.question_order, 'active', questions.active, 'section_id', questions.section_id) AS question,
            CONCAT('[', GROUP_CONCAT(JSON_OBJECT('choices_id', choices.id, 'choice_text', choices.choice_text, 'choice_value', choices.choice_value)), ']') AS choices
          FROM questions
            JOIN questions_choices
              ON questions.id = questions_choices.question_id
            JOIN choices
              ON questions_choices.choice_id = choices.id
          WHERE questions.id = ?
          GROUP BY questions.id;`,
          [question.id]
        );
        question.choices = JSON.parse(rows[0]?.choices || '[]');
      }

      section.questions = questions;
    }

    questionnaire.sections = sections;
  }
  if (questionnaires.length === 0) {
    throw new CustomError('No questionnaire found', 404);
  }
  return questionnaires[0];
};

const getQuestionnaireBySurveyKey = async (
  survey_key: string
): Promise<Questionnaire> => {
  const [rows] = await promisePool.execute<RowDataPacket[]>(
    `SELECT JSON_OBJECT ('id', questionnaires.id, 'date_time', questionnaires.date_time, 'name', questionnaires.name, 'description', questionnaires.description, 'questionnaire_status', questionnaires.questionnaire_status, 'end_date', questionnaires.end_date) AS questionnaire,
  JSON_OBJECT('id', surveys.id, 'date_time', surveys.date_time, 'start_date', surveys.start_date, 'end_date', surveys.end_date, 'min_responses', surveys.min_responses, 'max_responses', surveys.max_responses, 'survey_status', surveys.survey_status, 'user_id', surveys.user_id, 'survey_key', surveys.survey_key, 'housing_company_id', surveys.housing_company_id) AS survey  
  FROM questionnaires JOIN surveys ON questionnaires.id = surveys.questionnaire_id WHERE surveys.survey_key = ?;`,
    [survey_key]
  );

  if (rows.length === 0) {
    throw new CustomError('No questionnaire found', 404);
  }

  const questionnaire: GetQuestionnaire = JSON.parse(rows[0].questionnaire);
  questionnaire.survey = JSON.parse(rows[0].survey);

  const [sections] = await promisePool.execute<GetSection[]>(
    'SELECT sections.* FROM sections JOIN questionnaires_sections ON sections.id = questionnaires_sections.section_id WHERE questionnaires_sections.questionnaire_id = ?;',
    [questionnaire.id]
  );

  for (const section of sections) {
    const [questions] = await promisePool.execute<GetQuestion[]>(
      'SELECT * FROM questions WHERE section_id = ?;',
      [section.id]
    );

    for (const question of questions) {
      const [rows1] = await promisePool.execute<RowDataPacket[]>(
        `SELECT
        JSON_OBJECT ('question_id', questions.id, 'question', questions.question, 'weight', questions.weight, 'question_order', questions.question_order, 'active', questions.active, 'section_id', questions.section_id) AS question,
        CONCAT('[', GROUP_CONCAT(JSON_OBJECT('choices_id', choices.id, 'choice_text', choices.choice_text, 'choice_value', choices.choice_value)), ']') AS choices
      FROM questions
        JOIN questions_choices
          ON questions.id = questions_choices.question_id
        JOIN choices
          ON questions_choices.choice_id = choices.id
      WHERE questions.id = ?
      GROUP BY questions.id;`,
        [question.id]
      );
      question.choices = JSON.parse(rows1[0]?.choices || '[]');
    }

    section.questions = questions;
  }

  questionnaire.sections = sections;

  return questionnaire;
};

const getQuestionnaireSectionsBySurveyKey = async (
  key: string
): Promise<GetSection[]> => {
  const [rows] = await promisePool.execute<GetSection[]>(
    `SELECT sections.* 
    FROM sections 
    JOIN questionnaires_sections 
    ON sections.id = questionnaires_sections.section_id 
    JOIN questionnaires
    ON questionnaires_sections.questionnaire_id = questionnaires.id
    JOIN surveys
    ON questionnaires.id = surveys.questionnaire_id
    WHERE surveys.survey_key = ?;`,
    [key]
  );
  if (rows.length === 0) {
    throw new CustomError('No sections found', 404);
  }
  return rows;
};

const getQuestionnaireSectionsBySurveyId = async (
  id: number
): Promise<GetSection[]> => {
  const [rows] = await promisePool.execute<GetSection[]>(
    `SELECT sections.* 
    FROM sections 
    JOIN questionnaires_sections 
    ON sections.id = questionnaires_sections.section_id 
    JOIN questionnaires
    ON questionnaires_sections.questionnaire_id = questionnaires.id
    JOIN surveys
    ON questionnaires.id = surveys.questionnaire_id
    WHERE surveys.id = ?;`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('No sections found', 404);
  }
  return rows;
};

const postQuestionnaire = async (questionnaire: PostQuestionnaire) => {
  const [rows] = await promisePool.execute<ResultSetHeader>(
    `INSERT INTO questionnaires (date_time, header, description, is_published, end_date)
    VALUES (?, ?, ?, ?, ?);`,
    [
      questionnaire.date_time,
      questionnaire.name,
      questionnaire.description,
      questionnaire.questionnaire_status,
      questionnaire.end_date
    ]
  );
  if (rows.affectedRows === 0) {
    throw new CustomError('Questionnaire not created', 400);
  }
  return rows.insertId;
};

const putQuestionnaire = async (
  id: number,
  questionnaire: PutQuestionnaire
): Promise<ResultSetHeader> => {
  const sql = promisePool.format('UPDATE questionnaires SET ? WHERE id = ?;', [
    questionnaire,
    id
  ]);
  const [rows] = await promisePool.execute<ResultSetHeader>(sql);
  if (rows.affectedRows === 0) {
    throw new CustomError('Questionnaire not updated', 400);
  }
  return rows;
};

const deleteQuestionnaire = async (id: number): Promise<ResultSetHeader> => {
  const [rows] = await promisePool.execute<ResultSetHeader>(
    'DELETE FROM questionnaires WHERE id = ?;',
    [id]
  );
  if (rows.affectedRows === 0) {
    throw new CustomError('Questionnaire not deleted', 400);
  }
  return rows;
};

export {
  getAllQuestionnaires,
  getQuestionnaire,
  getQuestionnaireBySurveyKey,
  getQuestionnaireSectionsBySurveyId,
  getQuestionnaireSectionsBySurveyKey,
  postQuestionnaire,
  putQuestionnaire,
  deleteQuestionnaire
};
