import { promisePool } from '../../database/db';
import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';
import {
  GetHousingCompany,
  HousingCompany,
  PutHousingCompany
} from '../../interfaces/HousingCompany';
import { deleteAddress } from './addressModel';
import { deleteAllSurveysFromHousingCompany } from './surveyModel';

const getAllHousingCompanies = async (): Promise<HousingCompany[]> => {
  const [rows] = await promisePool.execute<GetHousingCompany[]>(
    `SELECT housing_companies.id, housing_companies.NAME, apartment_count, address_id, housing_companies.user_id,
    JSON_OBJECT('user_id', users.id, 'user_name', users.user_name) AS user,
    JSON_OBJECT('address_id', addresses.id, 'street', streets.name, 'number', addresses.number) AS address,
	 JSON_OBJECT('postcode_id', postcodes.id, 'code', postcodes.code, 'name', postcodes.name) AS postcode,
    JSON_OBJECT('city_id', cities.id, 'name', cities.name) AS city
    FROM housing_companies
    JOIN users
    ON housing_companies.user_id = users.id
    JOIN addresses
    ON housing_companies.address_id = addresses.id
    JOIN streets
    ON addresses.street_id = streets.id
    JOIN postcodes
    ON streets.postcode_id = postcodes.id
    JOIN cities
    ON postcodes.city_id = cities.id
    ;`
  );
  if (rows.length === 0) {
    throw new CustomError('No housing companies found', 404);
  }
  const housingCompanies: HousingCompany[] = rows.map((row) => ({
    ...row,
    user: JSON.parse(row.user?.toString() || '{}'),
    postcode: JSON.parse(row.postcode?.toString() || '{}'),
    city: JSON.parse(row.city?.toString() || '{}'),
    address: JSON.parse(row.address?.toString() || '{}')
  }));
  return housingCompanies;
};

const getHousingCompany = async (id: number, userID: number, role: string) => {
  const [hc] = await promisePool.execute<GetHousingCompany[]>(
    'SELECT user_id FROM housing_companies WHERE id = ?',
    [id]
  );

  if (hc[0].user_id === userID || role === 'admin') {
    const [rows] = await promisePool.execute<GetHousingCompany[]>(
      `SELECT housing_companies.id, housing_companies.NAME, apartment_count, address_id, housing_companies.user_id,
    JSON_OBJECT('user_id', users.id, 'user_name', users.user_name) AS user,
    JSON_OBJECT('address_id', addresses.id, 'street', streets.name, 'number', addresses.number) AS address,
	  JSON_OBJECT('postcode_id', postcodes.id, 'code', postcodes.code, 'name', postcodes.name) AS postcode,
    JSON_OBJECT('city_id', cities.id, 'name', cities.name) AS city
    FROM housing_companies
    JOIN users
    ON housing_companies.user_id = users.id
    JOIN addresses
    ON housing_companies.address_id = addresses.id
    JOIN streets
    ON addresses.street_id = streets.id
    JOIN postcodes
    ON streets.postcode_id = postcodes.id
    JOIN cities
    ON postcodes.city_id = cities.id
    WHERE housing_companies.id = ?
    ;`,
      [id]
    );
    if (rows.length === 0) {
      throw new CustomError('Housing company not found', 404);
    }
    return rows[0] as HousingCompany;
  } else {
    throw new CustomError('Unauthorized', 401);
  }
};

const getHousingCompaniesByUser = async (
  userID: number
): Promise<HousingCompany[]> => {
  const [rows] = await promisePool.execute<GetHousingCompany[]>(
    `SELECT housing_companies.id, housing_companies.NAME, apartment_count, address_id, housing_companies.user_id,
    JSON_OBJECT('user_id', users.id, 'user_name', users.user_name) AS user,
    JSON_OBJECT('address_id', addresses.id, 'street', streets.name, 'number', addresses.number) AS address,
	  JSON_OBJECT('postcode_id', postcodes.id, 'code', postcodes.code, 'name', postcodes.name) AS postcode,
    JSON_OBJECT('city_id', cities.id, 'name', cities.name) AS city
    FROM housing_companies
    JOIN users
    ON housing_companies.user_id = users.id
    JOIN addresses
    ON housing_companies.address_id = addresses.id
    JOIN streets
    ON addresses.street_id = streets.id
    JOIN postcodes
    ON streets.postcode_id = postcodes.id
    JOIN cities
    ON postcodes.city_id = cities.id
    WHERE housing_companies.user_id = ?
    ;`,
    [userID]
  );
  if (rows.length === 0) {
    throw new CustomError('No housing companies found', 404);
  }
  const housingCompanies: HousingCompany[] = rows.map((row) => ({
    ...row,
    user: JSON.parse(row.user?.toString() || '{}'),
    postcode: JSON.parse(row.postcode?.toString() || '{}'),
    city: JSON.parse(row.city?.toString() || '{}'),
    address: JSON.parse(row.address?.toString() || '{}')
  }));
  return housingCompanies;
};

const getApartmentCountByHousingCompany = async (
  id: number
): Promise<number> => {
  const [rows] = await promisePool.execute<GetHousingCompany[]>(
    `SELECT apartment_count FROM housing_companies
    WHERE id = ?;`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('No housing companies found', 404);
  }
  return rows[0].apartment_count as number;
};

const checkIfHousingCompanyBelongsToUser = async (
  id: number,
  userID: number
): Promise<boolean> => {
  const [rows] = await promisePool.execute<GetHousingCompany[]>(
    `SELECT user_id FROM housing_companies
    WHERE id = ?;`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('No housing companies found', 404);
  }
  if (rows[0].user_id === userID) {
    return true;
  } else {
    return false;
  }
};

const getHousingCompaniesByCurrentUser = async (
  userID: number
): Promise<HousingCompany[]> => {
  const [rows] = await promisePool.execute<GetHousingCompany[]>(
    `SELECT housing_companies.id, housing_companies.NAME, apartment_count, address_id, housing_companies.user_id,
    JSON_OBJECT('user_id', users.id, 'user_name', users.user_name) AS user,
    JSON_OBJECT('address_id', addresses.id, 'street', streets.name, 'number', addresses.number) AS address,
   JSON_OBJECT('postcode_id', postcodes.id, 'code', postcodes.code, 'name', postcodes.name) AS postcode,
    JSON_OBJECT('city_id', cities.id, 'name', cities.name) AS city
    FROM housing_companies
    JOIN users
    ON housing_companies.user_id = users.id
    JOIN addresses
    ON housing_companies.address_id = addresses.id
    JOIN streets
    ON addresses.street_id = streets.id
    JOIN postcodes
    ON streets.postcode_id = postcodes.id
    JOIN cities
    ON postcodes.city_id = cities.id
    WHERE housing_companies.user_id = ?
    ;`,
    [userID]
  );
  if (rows.length === 0) {
    throw new CustomError('No housing companies found', 404);
  }
  const housingCompanies: HousingCompany[] = rows.map((row) => ({
    ...row,
    user: JSON.parse(row.user?.toString() || '{}'),
    postcode: JSON.parse(row.postcode?.toString() || '{}'),
    city: JSON.parse(row.city?.toString() || '{}'),
    address: JSON.parse(row.address?.toString() || '{}')
  }));
  return housingCompanies;
};

const getHousingCompaniesByPostcode = async (
  postcodeID: number
): Promise<HousingCompany[]> => {
  const [rows] = await promisePool.execute<GetHousingCompany[]>(
    `SELECT housing_companies.id, housing_companies.NAME, apartment_count, address_id, housing_companies.user_id,
    JSON_OBJECT('user_id', users.id, 'user_name', users.user_name) AS user,
    JSON_OBJECT('address_id', addresses.id, 'street', streets.name, 'number', addresses.number) AS address,
	 JSON_OBJECT('postcode_id', postcodes.id, 'code', postcodes.code, 'name', postcodes.name) AS postcode,
    JSON_OBJECT('city_id', cities.id, 'name', cities.name) AS city
    FROM housing_companies
    JOIN users
    ON housing_companies.user_id = users.id
    JOIN addresses
    ON housing_companies.address_id = addresses.id
    JOIN streets
    ON addresses.street_id = streets.id
    JOIN postcodes
    ON streets.postcode_id = postcodes.id
    JOIN cities
    ON postcodes.city_id = cities.id
    WHERE postcodes.id = ?
    ;`,
    [postcodeID]
  );
  if (rows.length === 0) {
    throw new CustomError('No housing companies found', 404);
  }
  const housingCompanies: HousingCompany[] = rows.map((row) => ({
    ...row,
    user: JSON.parse(row.user?.toString() || '{}'),
    postcode: JSON.parse(row.postcode?.toString() || '{}'),
    city: JSON.parse(row.city?.toString() || '{}'),
    address: JSON.parse(row.address?.toString() || '{}')
  }));
  return housingCompanies;
};

const getHousingCompaniesByCity = async (
  cityID: number
): Promise<HousingCompany[]> => {
  const [rows] = await promisePool.execute<GetHousingCompany[]>(
    `SELECT housing_companies.id, housing_companies.NAME, apartment_count, address_id, housing_companies.user_id,
    JSON_OBJECT('user_id', users.id, 'user_name', users.user_name) AS user,
    JSON_OBJECT('address_id', addresses.id, 'street', streets.name, 'number', addresses.number) AS address,
	 JSON_OBJECT('postcode_id', postcodes.id, 'code', postcodes.code, 'name', postcodes.name) AS postcode,
    JSON_OBJECT('city_id', cities.id, 'name', cities.name) AS city
    FROM housing_companies
    JOIN users
    ON housing_companies.user_id = users.id
    JOIN addresses
    ON housing_companies.address_id = addresses.id
    JOIN streets
    ON addresses.street_id = streets.id
    JOIN postcodes
    ON streets.postcode_id = postcodes.id
    JOIN cities
    ON postcodes.city_id = cities.id
    WHERE cities.id = ?
    ;`,
    [cityID]
  );
  if (rows.length === 0) {
    throw new CustomError('No housing companies found', 404);
  }
  const housingCompanies: HousingCompany[] = rows.map((row) => ({
    ...row,
    user: JSON.parse(row.user?.toString() || '{}'),
    postcode: JSON.parse(row.postcode?.toString() || '{}'),
    city: JSON.parse(row.city?.toString() || '{}'),
    address: JSON.parse(row.address?.toString() || '{}')
  }));
  return housingCompanies;
};

const getHousingCompaniesByStreet = async (
  streetID: number
): Promise<HousingCompany[]> => {
  const [rows] = await promisePool.execute<GetHousingCompany[]>(
    `SELECT housing_companies.id, housing_companies.NAME, apartment_count, address_id, housing_companies.user_id,
    JSON_OBJECT('user_id', users.id, 'user_name', users.user_name) AS user,
    JSON_OBJECT('address_id', addresses.id, 'street', streets.name, 'number', addresses.number) AS address,
	 JSON_OBJECT('postcode_id', postcodes.id, 'code', postcodes.code, 'name', postcodes.name) AS postcode,
    JSON_OBJECT('city_id', cities.id, 'name', cities.name) AS city
    FROM housing_companies
    JOIN users
    ON housing_companies.user_id = users.id
    JOIN addresses
    ON housing_companies.address_id = addresses.id
    JOIN streets
    ON addresses.street_id = streets.id
    JOIN postcodes
    ON streets.postcode_id = postcodes.id
    JOIN cities
    ON postcodes.city_id = cities.id
    WHERE streets.id = ?
    ;`,
    [streetID]
  );
  if (rows.length === 0) {
    throw new CustomError('No housing companies found', 404);
  }
  const housingCompanies: HousingCompany[] = rows.map((row) => ({
    ...row,
    user: JSON.parse(row.user?.toString() || '{}'),
    postcode: JSON.parse(row.postcode?.toString() || '{}'),
    city: JSON.parse(row.city?.toString() || '{}')
  }));
  return housingCompanies;
};

const postHousingCompany = async (data: any): Promise<number> => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `INSERT INTO housing_companies (name, apartment_count, address_id, user_id)
    VALUES (?, ?, ?, ?);`,
    [data.name, data.apartment_count, data.address_id, data.user_id]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('No housing companies added', 404);
  }
  return headers.insertId;
};

const putHousingCompany = async (
  housingCompany: PutHousingCompany,
  id: number,
  userID: number,
  role: string
): Promise<boolean> => {
  let sql = 'UPDATE housing_companies SET ? WHERE id = ? AND user_id = ?;';
  let params = [housingCompany, id, userID];
  if (role === 'admin') {
    sql = 'UPDATE housing_companies SET ? WHERE id = ?;';
    params = [housingCompany, id];
  }
  const format = promisePool.format(sql, params);
  const [headers] = await promisePool.execute<ResultSetHeader>(format);
  if (headers.affectedRows === 0) {
    throw new CustomError('Housing company not found', 404);
  }
  return true;
};

const getAddressIDByHousingCompany = async (id: number): Promise<number> => {
  const [rows] = await promisePool.execute<GetHousingCompany[]>(
    `SELECT address_id FROM housing_companies
    WHERE id = ?;`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('No housing companies found', 404);
  }
  return rows[0].address_id as number;
};

const deleteHousingCompany = async (
  id: number,
  userID: number,
  role: string
): Promise<boolean> => {
  let sql = 'DELETE FROM housing_companies WHERE id = ? AND user_id = ?;';
  let params = [id, userID];
  if (role === 'admin') {
    sql = 'DELETE FROM housing_companies WHERE id = ?;';
    params = [id];
  }
  const addressID = await getAddressIDByHousingCompany(id);

  await deleteAllSurveysFromHousingCompany(id, userID, role);
  const [headers] = await promisePool.execute<ResultSetHeader>(sql, params);

  if (headers.affectedRows === 0) {
    throw new CustomError('No housing companies deleted', 400);
  }
  await deleteAddress(addressID);

  return true;
};

export {
  getAllHousingCompanies,
  getHousingCompany,
  getApartmentCountByHousingCompany,
  checkIfHousingCompanyBelongsToUser,
  getHousingCompaniesByUser,
  getHousingCompaniesByCurrentUser,
  getHousingCompaniesByPostcode,
  getHousingCompaniesByCity,
  getHousingCompaniesByStreet,
  postHousingCompany,
  putHousingCompany,
  deleteHousingCompany
};
