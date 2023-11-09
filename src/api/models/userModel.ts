import { promisePool } from '../../database/db';
import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';
import { GetUser, PostUser, PutUser, User } from '../../interfaces/User';


const getAllUsers = async (): Promise<User[]> => {
  const [rows] = await promisePool.execute<GetUser[]>(
    `SELECT id, user_name, email, role
    FROM users`,
  );
  if (rows.length === 0) {
    throw new CustomError('No users found', 404);
  }
  return rows;
};

const getUser = async (id: string): Promise<User> => {
  const [rows] = await promisePool.execute<GetUser[]>(
    `SELECT id, user_name, email, role
    FROM users
    WHERE id = ?`,
    [id],
  );
  if (rows.length === 0) {
    throw new CustomError('User not found', 404);
  }
  return rows[0];
};

const postUser = async (user: PostUser) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `INSERT INTO users (user_name, email, password)
    VALUES (?, ?, ?)`,
    [user.user_name, user.email, user.password],
  );
  return headers.insertId;
};

const putUser = async (data: PutUser, id: number): Promise<boolean> => {
  const sql = promisePool.format('UPDATE users SET ? WHERE id = ?;', [
    data,
    id,
  ]);
  if (data.role) {
    throw new CustomError('Cannot change role', 400);
  } 

  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('User not found', 404);
  }

  return true;
};

const deleteUser = async (id: number): Promise<boolean> => {
  const sql = promisePool.format('DELETE FROM users WHERE id = ?;', [id]);
  const [headers] = await promisePool.query<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('User not found', 404);
  }
  return true;
};

const getUserLogin = async (email: string): Promise<User> => {
  const [rows] = await promisePool.execute<GetUser[]>(
    `
    SELECT * FROM users 
    WHERE email = ?;
    `,
    [email],
  );
  if (rows.length === 0) {
    throw new CustomError('Invalid username/password', 200);
  }
  return rows[0];
};

export { getAllUsers, getUser, postUser, putUser, deleteUser, getUserLogin };
