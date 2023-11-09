import { ResultSetHeader } from 'mysql2';
import { promisePool } from '../../database/db';

import CustomError from '../../classes/CustomError';
import {
  Question,
  GetQuestion,
  PostQuestion,
  PutQuestion
} from '../../interfaces/Question';

const getAllQuestions = async (): Promise<Question[]> => {
  const [rows] = await promisePool.execute<GetQuestion[]>(
    'SELECT * FROM questions_choices_summary;'
  );
  if (rows.length === 0) {
    throw new CustomError('No questions found', 404);
  }

  const questions: Question[] = rows.map((row) => ({
    ...row,
    question: JSON.parse(row.question?.toString() || '{}'),
    choices: JSON.parse(row.choices?.toString() || '{}')
  }));
  return questions;
};

const getAllActiveQuestions = async (): Promise<Question[]> => {
  const [rows] = await promisePool.execute<GetQuestion[]>(
    'SELECT * FROM questions_choices_summary_active;'
  );
  if (rows.length === 0) {
    throw new CustomError('No questions found', 404);
  }
  const questions: Question[] = rows.map((row) => ({
    ...row,
    question: JSON.parse(row.question?.toString() || '{}'),
    choices: JSON.parse(row.choices?.toString() || '{}')
  }));
  return questions;
};

const getQuestion = async (id: string): Promise<Question> => {
  const [rows] = await promisePool.execute<GetQuestion[]>(
    `SELECT
        JSON_OBJECT ('question_id', questions.id, 'question', questions.question, 'weight', questions.weight, 'question_order', questions.question_order, 'active', active, 'section_id', section_id) AS question,
        GROUP_CONCAT(JSON_OBJECT('choices_id', choices.id, 'choice_text', choices.choice_text, 'choice_value', choices.choice_value)) AS choices
      FROM questions
        JOIN questions_choices
          ON questions.id = questions_choices.question_id
        JOIN choices
          ON questions_choices.choice_id = choices.id
      WHERE questions.id = ?;`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('No questions found', 404);
  }
  return rows[0];
};

const postQuestion = async (question: PostQuestion) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    'INSERT INTO questions (question_order, question, weight, section_id) VALUES (?, ?, ?, ?);',
    [
      question.question_order,
      question.question,
      question.weight,
      question.section_id
    ]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Question not created', 400);
  }
  return headers.insertId;
};

const putQuestion = async (data: PutQuestion, id: number) => {
  const sql = promisePool.format('UPDATE questions SET ? WHERE id = ?;', [
    data,
    id
  ]);
  const [headers] = await promisePool.execute<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('Question not updated', 400);
  }
  return headers.affectedRows;
};

const deleteQuestion = async (id: number) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    'DELETE FROM questions WHERE id = ?;',
    [id]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Question not deleted', 400);
  }
  return headers.affectedRows;
};

export {
  getAllQuestions,
  getAllActiveQuestions,
  getQuestion,
  postQuestion,
  putQuestion,
  deleteQuestion
};
