import { promisePool } from '../../database/db';
import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';
import {
  Section,
  GetSection,
  PostSection,
  PutSection
} from '../../interfaces/Section';

const getAllSections = async (): Promise<Section[]> => {
  const [rows] = await promisePool.execute<GetSection[]>(
    'SELECT * FROM sections;'
  );
  if (rows.length === 0) {
    throw new CustomError('No sections found', 404);
  }
  return rows;
};

const getSection = async (id: string): Promise<Section> => {
  const [rows] = await promisePool.execute<GetSection[]>(
    'SELECT * FROM sections WHERE id = ?',
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('No sections found', 404);
  }
  return rows[0];
};

const postSection = async (section: PostSection) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    'INSERT INTO sections (section_text) VALUES (?);',
    [section.section_text]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Section not created', 400);
  }
  return headers.insertId;
};

const putSection = async (data: PutSection, id: number) => {
  const sql = promisePool.format('UPDATE sections SET ? WHERE id = ?;', [
    data,
    id
  ]);
  const [headers] = await promisePool.execute<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('Section not updated', 400);
  }
  return headers.affectedRows;
};

const deleteSection = async (id: number) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    'DELETE FROM sections WHERE id = ?;',
    [id]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Section not deleted', 400);
  }
  return headers.affectedRows;
};

export { getAllSections, getSection, postSection, putSection, deleteSection };
