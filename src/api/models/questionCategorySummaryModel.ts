import { promisePool } from '../../database/db';
import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';

import {
  QuestionCategorySummary,
  GetQuestionCategorySummary,
  PostQuestionCategorySummary,
  PutQuestionCategorySummary
} from '../../interfaces/QuestionCategorySummary';

const getAllQuestionCategorySummaries = async (): Promise<
  QuestionCategorySummary[]
> => {
  const [rows] = await promisePool.execute<GetQuestionCategorySummary[]>(
    `SELECT question_category_summaries.id, question_category_summaries.result, question_category_summaries.summary,
    JSON_OBJECT('id', question_categories.id, 'category', question_categories.category) AS question_category
    FROM question_category_summaries
    JOIN question_categories
    ON question_category_summaries.question_category_id = question_categories.id;`
  );
  if (rows.length === 0) {
    throw new CustomError('No question category summaries found', 404);
  }
  return rows;
};

const getQuestionCategorySummary = async (
  id: number
): Promise<GetQuestionCategorySummary> => {
  const [rows] = await promisePool.execute<GetQuestionCategorySummary[]>(
    `SELECT question_category_summaries.id, question_category_summaries.result, question_category_summaries.summary,
    JSON_OBJECT('id', question_categories.id, 'category', question_categories.category) AS question_category
    FROM question_category_summaries
    JOIN question_categories
    ON question_category_summaries.question_category_id = question_categories.id
    WHERE question_category_summaries.id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('No question category summaries found', 404);
  }
  return rows[0];
};

const getQuestionCategorySummaryByCategoryId = async (
  question_category_id: number
): Promise<GetQuestionCategorySummary> => {
  const [rows] = await promisePool.execute<GetQuestionCategorySummary[]>(
    `SELECT question_category_summaries.id, question_category_summaries.result, question_category_summaries.summary,
    JSON_OBJECT('id', question_categories.id, 'category', question_categories.category) AS question_category
    FROM question_category_summaries
    JOIN question_categories
    ON question_category_summaries.question_category_id = question_categories.id
    WHERE question_category_summaries.question_category_id = ?`,
    [question_category_id]
  );
  if (rows.length === 0) {
    throw new CustomError('No question category summaries found', 404);
  }
  return rows[0];
};

const getQuestionCategorySummaryByCategoryIdAndResult = async (
  question_category_id: number,
  result: string
): Promise<GetQuestionCategorySummary> => {
  const [rows] = await promisePool.execute<GetQuestionCategorySummary[]>(
    `SELECT question_category_summaries.summary, question_category_summaries.result
    FROM question_category_summaries
    WHERE question_category_summaries.question_category_id = ?
    AND question_category_summaries.result = ?`,
    [question_category_id, result]
  );
  if (rows.length === 0) {
    throw new CustomError('No question category summaries found', 404);
  }
  return rows[0];
};

const postQuestionCategorySummary = async (
  questionCategorySummary: PostQuestionCategorySummary
) => {
  const [rows] = await promisePool.execute<ResultSetHeader>(
    `INSERT INTO question_category_summaries (question_category_id, result, summary)
    VALUES (?, ?, ?);`,
    [
      questionCategorySummary.question_category_id,
      questionCategorySummary.result,
      questionCategorySummary.summary
    ]
  );
  if (rows.affectedRows === 0) {
    throw new CustomError('Question category summary not created', 400);
  }
  return rows.insertId;
};

const putQuestionCategorySummary = async (
  id: number,
  data: PutQuestionCategorySummary
): Promise<boolean> => {
  const format = promisePool.format(
    `UPDATE question_category_summaries
    SET ?
    WHERE id = ?;`,
    [data, id]
  );
  const [rows] = await promisePool.execute<ResultSetHeader>(format);
  if (rows.affectedRows === 0) {
    throw new CustomError('Question category summary not updated', 400);
  }
  return true;
};

const deleteQuestionCategorySummary = async (
  id: number
): Promise<ResultSetHeader> => {
  const [rows] = await promisePool.execute<ResultSetHeader>(
    `DELETE FROM question_category_summaries
    WHERE id = ?;`,
    [id]
  );
  if (rows.affectedRows === 0) {
    throw new CustomError('Question category summary not deleted', 400);
  }
  return rows;
};

export {
  getAllQuestionCategorySummaries,
  getQuestionCategorySummary,
  getQuestionCategorySummaryByCategoryId,
  getQuestionCategorySummaryByCategoryIdAndResult,
  postQuestionCategorySummary,
  putQuestionCategorySummary,
  deleteQuestionCategorySummary
};
