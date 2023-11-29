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
    `SELECT section_summary.id, section_summary.positive, section_summary.even, section_summary.negative,
    JSON_OBJECT('id', sections.id, 'section_text', section_text, 'active', active, 'description', description) AS section
    FROM section_summary
    JOIN sections
    ON section_summary.section_id = sections.id;`
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
    `SELECT section_summary.id, section_summary.positive, section_summary.even, section_summary.negative,
    JSON_OBJECT('id', sections.id, 'section_text', section_text, 'active', active, 'description', description) AS section
    FROM section_summary
    JOIN sections
    ON section_summary.section_id = sections.id
    WHERE section_summary.id = ?`,
    [id]
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
    `INSERT INTO section_summary (positive, even, negative, section_id)
    VALUES (?, ?, ?, ?);`,
    [
      sectionSummary.positive,
      sectionSummary.even,
      sectionSummary.negative,
      sectionSummary.section_id
    ]
  );
  return rows;
};

const putSectionSummary = async (
  data: PutSectionSummary,
  id: number
): Promise<ResultSetHeader> => {
  const [rows] = await promisePool.execute<ResultSetHeader>(
    `UPDATE section_summary
    SET positive = ?, even = ?, negative = ?, section_id = ?
    WHERE id = ?;`,
    [data.positive, data.even, data.negative, data.section_id, id]
  );
  return rows;
};

const deleteSectionSummary = async (id: number): Promise<ResultSetHeader> => {
  const [rows] = await promisePool.execute<ResultSetHeader>(
    `DELETE FROM section_summary
    WHERE id = ?;`,
    [id]
  );
  return rows;
};

export {
  getAllSectionSummaries,
  getSectionSummary,
  postSectionSummary,
  putSectionSummary,
  deleteSectionSummary
};
