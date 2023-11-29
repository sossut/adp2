import { promisePool } from '../../database/db';
import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';

import {
  ResultSummary,
  GetResultSummary,
  PostResultSummary,
  PutResultSummary
} from '../../interfaces/ResultSummary';

const getAllResultSummaries = async (): Promise<ResultSummary[]> => {
  const [rows] = await promisePool.execute<GetResultSummary[]>(
    `SELECT *
    FROM result_summaries;`
  );
  if (rows.length === 0) {
    throw new CustomError('No result summaries found', 404);
  }
  // const resultSummaries: ResultSummary[] = rows.map((row) => ({
  //   ...row,
  //   section: JSON.parse(row.section?.toString() || '{}'),
  //   survey: JSON.parse(row.survey?.toString() || '{}')
  // }));
  // return resultSummaries;
  return rows;
};

const getResultSummary = async (id: string): Promise<GetResultSummary> => {
  const [rows] = await promisePool.execute<GetResultSummary[]>(
    `SELECT * 
    FROM result_summaries
    WHERE result_summaries.id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('No result summaries found', 404);
  }
  return rows[0];
};

const getResultSummaryByValues = async (
  section_one: string,
  section_two: string,
  section_three: string
): Promise<GetResultSummary> => {
  const [rows] = await promisePool.execute<GetResultSummary[]>(
    `SELECT id 
    FROM result_summaries
    WHERE result_summaries.section_one = ?
    AND result_summaries.section_two = ?
    AND result_summaries.section_three = ?`,
    [section_one, section_two, section_three]
  );
  if (rows.length === 0) {
    throw new CustomError('No result summaries found', 404);
  }
  return rows[0];
};

const postResultSummary = async (
  resultSummary: PostResultSummary
): Promise<ResultSetHeader> => {
  const [rows] = await promisePool.execute<ResultSetHeader>(
    `INSERT INTO result_summaries (result_summary, recommendation, section_one, section_two, section_three)
    VALUES (?, ?, ?, ?, ?);`,
    [
      resultSummary.summary,
      resultSummary.recommendation,
      resultSummary.section_one,
      resultSummary.section_two,
      resultSummary.section_three
    ]
  );
  return rows;
};

const putResultSummary = async (
  data: PutResultSummary,
  id: number
): Promise<ResultSetHeader> => {
  const sql = promisePool.format(
    `UPDATE result_summaries 
    SET ? WHERE id = ?;`,
    [data, id]
  );
  const [rows] = await promisePool.execute<ResultSetHeader>(sql);
  if (rows.affectedRows === 0) {
    throw new CustomError('Result summary not updated', 400);
  }
  return rows;
};

const deleteResultSummary = async (id: number): Promise<ResultSetHeader> => {
  const [rows] = await promisePool.execute<ResultSetHeader>(
    `DELETE FROM 
    result_summaries WHERE id = ?;`,
    [id]
  );
  if (rows.affectedRows === 0) {
    throw new CustomError('Result summary not deleted', 400);
  }
  return rows;
};

export {
  getAllResultSummaries,
  getResultSummary,
  getResultSummaryByValues,
  postResultSummary,
  putResultSummary,
  deleteResultSummary
};
