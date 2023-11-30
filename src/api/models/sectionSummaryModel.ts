import { promisePool } from '../../database/db';
import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';

import {
  SectionSummary,
  GetSectionSummary,
  PostSectionSummary,
  PutSectionSummary
} from '../../interfaces/SectionSummary';

const getAllSectionSummaries = async (): Promise<SectionSummary[]> => {
  const [rows] = await promisePool.execute<GetSectionSummary[]>(
    `SELECT section_summaries.id, section_summaries.result, section_summaries.summary,
    JSON_OBJECT('id', sections.id, 'section_text', section_text, 'active', active, 'description', description) AS section
    FROM section_summaries
    JOIN sections
    ON section_summaries.section_id = sections.id;`
  );
  if (rows.length === 0) {
    throw new CustomError('No section summaries found', 404);
  }
  // const sectionSummaries: SectionSummary[] = rows.map((row) => ({
  //   ...row,
  //   section: JSON.parse(row.section?.toString() || '{}')
  // }));
  // return sectionSummaries;
  return rows;
};

const getSectionSummary = async (id: number): Promise<GetSectionSummary> => {
  const [rows] = await promisePool.execute<GetSectionSummary[]>(
    `SELECT section_summaries.id, section_summaries.result, section_summaries.summary,
    JSON_OBJECT('id', sections.id, 'section_text', section_text, 'active', active, 'description', description) AS section
    FROM section_summaries
    JOIN sections
    ON section_summaries.section_id = sections.id
    WHERE section_summaries.id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('No section summaries found', 404);
  }
  return rows[0];
};

const getSectionSummaryBySectionIdAndResult = async (
  section_id: number,
  result: string
): Promise<GetSectionSummary> => {
  const [rows] = await promisePool.execute<GetSectionSummary[]>(
    `SELECT *
    FROM section_summaries
    WHERE section_id = ? AND result = ?;`,
    [section_id, result]
  );
  if (rows.length === 0) {
    throw new CustomError('No section summaries found', 404);
  }
  return rows[0];
};

const postSectionSummary = async (
  sectionSummary: PostSectionSummary
): Promise<ResultSetHeader> => {
  const [rows] = await promisePool.execute<ResultSetHeader>(
    `INSERT INTO section_summaries (result, summary, section_id)
    VALUES (?, ?, ?);`,
    [sectionSummary.result, sectionSummary.summary, sectionSummary.section_id]
  );
  return rows;
};

const putSectionSummary = async (
  data: PutSectionSummary,
  id: number
): Promise<ResultSetHeader> => {
  let sql = promisePool.format(
    `UPDATE section_summaries
    SET ?
    WHERE id = ?;`,
    [data, id]
  );
  const [rows] = await promisePool.execute<ResultSetHeader>(sql);
  return rows;
};

const deleteSectionSummary = async (id: number): Promise<ResultSetHeader> => {
  const [rows] = await promisePool.execute<ResultSetHeader>(
    `DELETE FROM section_summaries
    WHERE id = ?;`,
    [id]
  );
  return rows;
};

export {
  getAllSectionSummaries,
  getSectionSummary,
  getSectionSummaryBySectionIdAndResult,
  postSectionSummary,
  putSectionSummary,
  deleteSectionSummary
};
