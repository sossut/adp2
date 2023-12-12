import { promisePool } from '../../database/db';
import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';
import {
  GetPostcode,
  PostPostcode,
  Postcode,
  PutPostcode
} from '../../interfaces/Postcode';
import {
  GetHousingCompany,
  HousingCompany
} from '../../interfaces/HousingCompany';

const getAllPostcodes = async (): Promise<Postcode[]> => {
  const [rows] = await promisePool.execute<GetPostcode[]>(
    `SELECT postcodes.id, postcodes.name, postcodes.code, area,
    JSON_OBJECT('city_id', cities.id, 'name', cities.name) AS city
    FROM postcodes
    JOIN cities
    ON postcodes.city_id = cities.id;`
  );
  if (rows.length === 0) {
    throw new CustomError('No postcodes found', 404);
  }
  // const postcodes: Postcode[] = rows.map((row) => ({
  //   ...row,
  //   city: JSON.parse(row.city?.toString() || '{}')
  // }));
  // return postcodes;
  return rows;
};

const getPostcode = async (id: string): Promise<GetPostcode> => {
  const [rows] = await promisePool.execute<GetPostcode[]>(
    `SELECT postcodes.id, postcodes.name, postcodes.code, area,
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

const getPostcodesWhereCurrentUserHasHousingCompanies = async (
  userID: number
): Promise<HousingCompany[]> => {
  const [rows] = await promisePool.execute<GetHousingCompany[]>(
    `SELECT postcodes.id, postcodes.code, postcodes.name FROM housing_companies
    JOIN addresses
    ON housing_companies.address_id = addresses.id
    JOIN streets
    ON addresses.street_id = streets.id
    JOIN postcodes
    ON streets.postcode_id = postcodes.id
    WHERE housing_companies.user_id = ?
    ;`,
    [userID]
  );
  if (rows.length === 0) {
    throw new CustomError('No housing companies found', 404);
  }
  // const postcodes: number[] = rows.map((row) => row.id);
  return rows;
};

const postPostcode = async (postcode: PostPostcode) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    'INSERT INTO postcodes (code, name, city_id, area) VALUES (?, ?, ?, ?);',
    [postcode.code, postcode.name, postcode.city_id, postcode.area]
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
  getPostcodesWhereCurrentUserHasHousingCompanies,
  postPostcode,
  putPostcode,
  deletePostcode
};
