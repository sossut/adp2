import { promisePool } from '../../database/db';
import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';
import { GetAddress, PostAddress, PutAddress } from '../../interfaces/Address';

const getAllAddresses = async (): Promise<GetAddress[]> => {
  const [rows] = await promisePool.execute<GetAddress[]>(
    'SELECT * FROM addresses;'
  );
  if (rows.length === 0) {
    throw new CustomError('No addresses found', 404);
  }
  return rows;
};

const getAddress = async (id: string): Promise<GetAddress> => {
  const [rows] = await promisePool.execute<GetAddress[]>(
    'SELECT * FROM addresses WHERE id = ?',
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('No addresses found', 404);
  }
  return rows[0];
};

const getAddressByPostcodeAndStreetAndNumber = async (
  postcode: string,
  street: string,
  number: string
): Promise<GetAddress> => {
  const [rows] = await promisePool.execute<GetAddress[]>(
    `SELECT addresses.id, number, street_id FROM addresses
    JOIN streets
    ON addresses.street_id = streets.id
    JOIN postcodes
    ON streets.postcode_id = postcodes.id
    WHERE postcodes.code = ?
    AND streets.name = ?
    AND number = ?`,
    [postcode, street, number]
  );
  if (rows.length === 0) {
    throw new CustomError('No addresses found', 404);
  }
  return rows[0];
};

const postAddress = async (address: PostAddress) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    'INSERT INTO addresses (number, street_id) VALUES (?, ?);',
    [address.number, address.street_id]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Address not created', 400);
  }
  return headers.insertId;
};

const putAddress = async (data: PutAddress, id: number) => {
  const sql = promisePool.format('UPDATE addresses SET ? WHERE id = ?;', [
    data,
    id
  ]);
  const [headers] = await promisePool.execute<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('Address not updated', 400);
  }
  return headers.affectedRows;
};

const deleteAddress = async (id: number) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    'DELETE FROM addresses WHERE id = ?;',
    [id]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Address not deleted', 400);
  }
  return headers.affectedRows;
};

export {
  getAllAddresses,
  getAddress,
  getAddressByPostcodeAndStreetAndNumber,
  postAddress,
  putAddress,
  deleteAddress
};
