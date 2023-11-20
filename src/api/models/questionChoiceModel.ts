import { promisePool } from '../../database/db';
import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';
import {
  GetQuestionChoice,
  PostQuestionChoice,
  PutQuestionChoice,
  QuestionChoice
} from '../../interfaces/QuestionChoice';

const getAllQuestionChoices = async (): Promise<QuestionChoice[]> => {
  const [rows] = await promisePool.execute<GetQuestionChoice[]>(
    `SELECT questions_choices.id, question_choices.question_id, question_choices.choice_id
    FROM question_choices;`
  );
  if (rows.length === 0) {
    throw new CustomError('No question_choices found', 404);
  }
  const questionChoices: QuestionChoice[] = rows.map((row) => ({
    ...row
  }));
  return questionChoices;
};

const getQuestionChoice = async (id: string): Promise<GetQuestionChoice> => {
  const [rows] = await promisePool.execute<GetQuestionChoice[]>(
    `SELECT questions_choices.id, question_choices.question_id, question_choices.choice_id
    FROM question_choices
    WHERE question_choices.id = ?;`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('No question_choices found', 404);
  }
  return rows[0];
};

const getQuestionChoiceIdsByQuestionId = async (
  question_id: number
): Promise<QuestionChoice[]> => {
  const [rows] = await promisePool.execute<GetQuestionChoice[]>(
    `SELECT id
    FROM questions_choices
    WHERE question_id = ?;`,
    [question_id]
  );
  if (rows.length === 0) {
    throw new CustomError('No question_choices found', 404);
  }
  return rows;
};

const getQuestionChoicesByQuestionId = async (
  question_id: number
): Promise<GetQuestionChoice[]> => {
  const [rows] = await promisePool.execute<GetQuestionChoice[]>(
    `SELECT
        JSON_OBJECT ('question_id', questions.id, 'question', questions.question, 'weight', questions.weight, 'question_order', questions.question_order) AS question,
        GROUP_CONCAT(JSON_OBJECT('choices_id', choices.id, 'choice_text', choices.choice_text, 'choice_value', choices.choice_value)) AS choices
      FROM questions
        JOIN questions_choices
          ON questions.id = questions_choices.question_id
        JOIN choices
          ON questions_choices.choice_id = choices.id
      WHERE questions.id = ?;`,
    [question_id]
  );
  if (rows.length === 0) {
    throw new CustomError('No question_choices found', 404);
  }
  return rows;
};

const postQuestionChoice = async (questionChoice: PostQuestionChoice) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    'INSERT INTO questions_choices (question_id, choice_id) VALUES (?, ?);',
    [questionChoice.question_id, questionChoice.choice_id]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('QuestionChoice not created', 400);
  }
  return headers.insertId;
};

const putQuestionChoice = async (data: PutQuestionChoice, id: number) => {
  const sql = promisePool.format(
    'UPDATE questions_choices SET ? WHERE id = ?;',
    [data, id]
  );
  const [headers] = await promisePool.execute<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('QuestionChoice not updated', 400);
  }
  return headers.affectedRows;
};

const deleteQuestionChoice = async (id: number) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    'DELETE FROM questions_choices WHERE id = ?;',
    [id]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('QuestionChoice not deleted', 400);
  }
  return headers.affectedRows;
};

export {
  getAllQuestionChoices,
  getQuestionChoice,
  getQuestionChoiceIdsByQuestionId,
  getQuestionChoicesByQuestionId,
  postQuestionChoice,
  putQuestionChoice,
  deleteQuestionChoice
};
