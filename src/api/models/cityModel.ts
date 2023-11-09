import { promisePool } from '../../database/db';
import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';
import { GetCity, PostCity, PutCity } from '../../interfaces/City';

const getAllCities = async (): Promise<GetCity[]> => {
  const [rows] = await promisePool.execute<GetCity[]>('SELECT * FROM cities;');
  if (rows.length === 0) {
    throw new CustomError('No cities found', 404);
  }
  return rows;
};

const getCity = async (id: string): Promise<GetCity> => {
  const [rows] = await promisePool.execute<GetCity[]>(
    'SELECT * FROM cities WHERE id = ?',
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('No cities found', 404);
  }
  return rows[0];
};

const getCityIdByName = async (name: string): Promise<number> => {
  const [rows] = await promisePool.execute<GetCity[]>(
    'SELECT * FROM cities WHERE name = ?',
    [name]
  );
  if (rows.length === 0) {
    throw new CustomError('No cities found', 404);
  }
  return rows[0].id;
};

const postCity = async (city: PostCity) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    'INSERT INTO cities (name) VALUES (?);',
    [city.name]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('City not created', 400);
  }
  return headers.insertId;
};

const putCity = async (data: PutCity, id: number) => {
  const sql = promisePool.format('UPDATE cities SET ? WHERE id = ?;', [
    data,
    id
  ]);
  const [headers] = await promisePool.execute<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('City not updated', 400);
  }
  return headers.affectedRows;
};

const deleteCity = async (id: number) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    'DELETE FROM cities WHERE id = ?;',
    [id]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('City not deleted', 400);
  }
  return headers.affectedRows;
};

export {
  getAllCities,
  getCity,
  getCityIdByName,
  postCity,
  putCity,
  deleteCity
};
