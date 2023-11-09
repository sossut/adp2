import { promisePool } from '../../database/db';
import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';
import {
  GetPostcode,
  PostPostcode,
  Postcode,
  PutPostcode
} from '../../interfaces/Postcode';

const getAllPostcodes = async (): Promise<Postcode[]> => {
  const [rows] = await promisePool.execute<GetPostcode[]>(
    `SELECT postcodes.id, postcodes.name, postcodes.code,
    JSON_OBJECT('city_id', cities.id, 'name', cities.name) AS city
    FROM postcodes
    JOIN cities
    ON postcodes.city_id = cities.id;`
  );
  if (rows.length === 0) {
    throw new CustomError('No postcodes found', 404);
  }
  const postcodes: Postcode[] = rows.map((row) => ({
    ...row,
    city: JSON.parse(row.city?.toString() || '{}')
  }));
  return postcodes;
};

const getPostcode = async (id: string): Promise<GetPostcode> => {
  const [rows] = await promisePool.execute<GetPostcode[]>(
    `SELECT postcodes.id, postcodes.name, postcodes.code,
    JSON_OBJECT('city_id', cities.id, 'name', cities.name) AS city
    FROM postcodes
    JOIN cities
    ON postcodes.city_id = cities.id 
    WHERE postcodes.id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('No postcodes found', 404);
  }
  return rows[0];
};

const getPostcodeIdByCode = async (code: string): Promise<number> => {
  const [rows] = await promisePool.execute<GetPostcode[]>(
    `SELECT * FROM postcodes
    WHERE postcodes.code = ?`,
    [code]
  );
  if (rows.length === 0) {
    throw new CustomError('No postcodes found', 404);
  }
  return rows[0].id;
};

const postPostcode = async (postcode: PostPostcode) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    'INSERT INTO postcodes (code, name, city_id) VALUES (?, ?, ?);',
    [postcode.code, postcode.name, postcode.city_id]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Postcode not created', 400);
  }
  return headers.insertId;
};

const putPostcode = async (data: PutPostcode, id: number) => {
  const sql = promisePool.format('UPDATE postcodes SET ? WHERE id = ?;', [
    data,
    id
  ]);
  const [headers] = await promisePool.execute<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('Postcode not updated', 400);
  }
  return headers.affectedRows;
};

const deletePostcode = async (id: number) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    'DELETE FROM postcodes WHERE id = ?;',
    [id]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Postcode not deleted', 400);
  }
  return headers.affectedRows;
};

export {
  getAllPostcodes,
  getPostcode,
  getPostcodeIdByCode,
  postPostcode,
  putPostcode,
  deletePostcode
};
