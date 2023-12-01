import { promisePool } from '../../database/db';
import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';

import {
  QuestionCategory,
  GetQuestionCategory,
  PostQuestionCategory,
  PutQuestionCategory
} from '../../interfaces/QuestionCategory';

const getAllQuestionCategories = async (): Promise<QuestionCategory[]> => {
  const [rows] = await promisePool.execute<GetQuestionCategory[]>(
    'SELECT * FROM question_categories;'
  );
  if (rows.length === 0) {
    throw new CustomError('No question categories found', 404);
  }
  return rows;
};

const getQuestionCategory = async (id: number): Promise<QuestionCategory> => {
  const [rows] = await promisePool.execute<GetQuestionCategory[]>(
    `SELECT * FROM question_categories
    WHERE question_categories.id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('No question categories found', 404);
  }
  return rows[0];
};

const postQuestionCategory = async (questionCategory: PostQuestionCategory) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    'INSERT INTO question_categories (name) VALUES (?);',
    [questionCategory.category]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Question category not created', 400);
  }
  return headers.insertId;
};

const putQuestionCategory = async (
  data: PutQuestionCategory,
  id: number
): Promise<boolean> => {
  const sql = promisePool.format(
    'UPDATE question_categories SET ? WHERE id = ?;',
    [data, id]
  );
  const [headers] = await promisePool.execute<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('Question category not updated', 400);
  }
  return true;
};

const deleteQuestionCategory = async (id: number): Promise<boolean> => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    'DELETE FROM question_categories WHERE id = ?;',
    [id]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Question category not deleted', 400);
  }
  return true;
};

export {
  getAllQuestionCategories,
  getQuestionCategory,
  postQuestionCategory,
  putQuestionCategory,
  deleteQuestionCategory
};
