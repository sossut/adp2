import { promisePool } from '../../database/db';
import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';
import {
  GetStreet,
  PostStreet,
  PutStreet,
  Street
} from '../../interfaces/Street';

const getAllStreets = async (): Promise<Street[]> => {
  const [rows] = await promisePool.execute<GetStreet[]>(
    `SELECT streets.id, streets.name,
    JSON_OBJECT('id', postcodes.id, 'code', postcodes.code, 'name', postcodes.name) AS postcode,
    JSON_OBJECT('city_id', cities.id, 'name', cities.name) AS city
    FROM streets
    JOIN postcodes
    ON streets.postcode_id = postcodes.id
    JOIN cities
    ON postcodes.city_id = cities.id;`
  );
  if (rows.length === 0) {
    throw new CustomError('No streets found', 404);
  }
  const postcodes: Street[] = rows.map((row) => ({
    ...row,
    postcode: JSON.parse(row.postcode?.toString() || '{}'),
    city: JSON.parse(row.city?.toString() || '{}')
  }));
  return postcodes;
};

const getStreet = async (id: string): Promise<GetStreet> => {
  const [rows] = await promisePool.execute<GetStreet[]>(
    `SELECT streets.id, streets.name,
    JSON_OBJECT('id', postcodes.id, 'code', postcodes.code, 'name', postcodes.name) AS postcode,
    JSON_OBJECT('city_id', cities.id, 'name', cities.name) AS city
    FROM streets
    JOIN postcodes
    ON streets.postcode_id = postcodes.id
    JOIN cities
    ON postcodes.city_id = cities.id
    WHERE streets.id = ?;`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('No streets found', 404);
  }
  return rows[0];
};

const getStreetIdByNameAndPostcodeID = async (
  name: string,
  postcode_id: number
): Promise<number> => {
  const [rows] = await promisePool.execute<GetStreet[]>(
    `SELECT * FROM streets
    WHERE streets.name = ? AND postcode_id = ?;`,
    [name, postcode_id]
  );
  if (rows.length === 0) {
    throw new CustomError('No streets found', 404);
  }
  return rows[0].id;
};

const postStreet = async (street: PostStreet) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    'INSERT INTO streets (name, postcode_id) VALUES (?, ?);',
    [street.name, street.postcode_id]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Street not created', 400);
  }
  return headers.insertId;
};

const putStreet = async (data: PutStreet, id: number) => {
  const sql = promisePool.format('UPDATE streets SET ? WHERE id = ?;', [
    data,
    id
  ]);
  const [headers] = await promisePool.execute<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('Street not updated', 400);
  }
  return headers.affectedRows;
};

const deleteStreet = async (id: number) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    'DELETE FROM streets WHERE id = ?;',
    [id]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Street not deleted', 400);
  }
  return headers.affectedRows;
};

export {
  getAllStreets,
  getStreet,
  getStreetIdByNameAndPostcodeID,
  postStreet,
  putStreet,
  deleteStreet
};
