import { promisePool } from '../../database/db';
import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';

import {
  UserSectionSummary,
  GetUserSectionSummary,
  PostUserSectionSummary,
  PutUserSectionSummary
} from '../../interfaces/UserSectionSummary';

const getAllUserSectionSummaries = async (): Promise<UserSectionSummary[]> => {
  const [rows] = await promisePool.execute<GetUserSectionSummary[]>(
    `SELECT *
    FROM user_section_summaries;`
  );
  if (rows.length === 0) {
    throw new CustomError('No user section summaries found', 404);
  }
  // const userSectionSummaries: UserSectionSummary[] = rows.map((row) => ({
  //   ...row,
  //   section: JSON.parse(row.section?.toString() || '{}')
  // }));
  // return userSectionSummaries;
  return rows;
};

const getUserSectionSummary = async (
  id: string
): Promise<GetUserSectionSummary> => {
  const [rows] = await promisePool.execute<GetUserSectionSummary[]>(
    `SELECT * 
    FROM user_section_summaries
    WHERE user_section_summaries.id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('No user section summaries found', 404);
  }
  return rows[0];
};

const getUserSectionSummaryBySectionId = async (
  user_id: number,
  section_id: number
): Promise<GetUserSectionSummary> => {
  const [rows] = await promisePool.execute<GetUserSectionSummary[]>(
    `SELECT * 
    FROM user_section_summaries
    AND user_section_summaries.section_id = ?`,
    [user_id, section_id]
  );
  if (rows.length === 0) {
    throw new CustomError('No user section summaries found', 404);
  }
  return rows[0];
};

const getUserSectionSummaryBySectionIdAndResult = async (
  section_id: number,
  result: string
): Promise<GetUserSectionSummary> => {
  console.log(section_id, result);
  const [rows] = await promisePool.execute<GetUserSectionSummary[]>(
    `SELECT * 
    FROM user_section_summaries
    WHERE user_section_summaries.section_id = ?
    AND user_section_summaries.result = ?;`,
    [section_id, result]
  );
  if (rows.length === 0) {
    throw new CustomError('No user section summaries found', 404);
  }
  return rows[0];
};

const postUserSectionSummary = async (data: PostUserSectionSummary) => {
  const [rows] = await promisePool.execute<ResultSetHeader>(
    `INSERT INTO user_section_summaries
    (result, summary, section_id)
    VALUES
    (?, ?, ?);`,
    [data.result, data.summary, data.section_id]
  );

  return rows.insertId;
};

const putUserSectionSummary = async (
  id: number,
  data: PutUserSectionSummary
): Promise<boolean> => {
  const format = promisePool.format(
    `UPDATE user_section_summaries
    SET ?
    WHERE id = ?
    ;`,
    [data, id]
  );
  const [rows] = await promisePool.execute<ResultSetHeader>(format);
  if (rows.affectedRows === 0) {
    throw new CustomError('No user section summaries found', 404);
  }
  return true;
};

const deleteUserSectionSummary = async (id: number): Promise<boolean> => {
  const format = promisePool.format(
    `DELETE FROM user_section_summaries
    WHERE id = ?;`,
    [id]
  );
  const [rows] = await promisePool.execute<ResultSetHeader>(format);
  if (rows.affectedRows === 0) {
    throw new CustomError('No user section summaries found', 404);
  }
  return true;
};

export {
  getAllUserSectionSummaries,
  getUserSectionSummary,
  getUserSectionSummaryBySectionId,
  getUserSectionSummaryBySectionIdAndResult,
  postUserSectionSummary,
  putUserSectionSummary,
  deleteUserSectionSummary
};
