import {
  deleteUser,
  getCurrentUser,
  getSingleUser,
  getUser,
  postAuthLogin,
  postAuthLoginError,
  postUser,
  putUser
} from './userTest';
import app from '../src/app';
import { User } from '../src/interfaces/User';
import { closePool } from '../src/database/db';
import { getNotFound } from './testTest';

interface UserWithToken {
  user: User;
  token: string;
}

describe('GET /api/v1', () => {
  afterAll(async () => {
    // close database connection
    await closePool();
  });

  // test not found
  it('responds with a not found message', async () => {
    await getNotFound(app);
  });

  // test login error
  it('should return error message on invalid credentials', async () => {
    await postAuthLoginError(app);
  });

  // test create user
  let token = '';
  let user: UserWithToken;
  it('should create a new user', async () => {
    user = await postUser(app, {
      username: 'Test User ' + new Date().toLocaleDateString('fi-FI'),
      email: 'test@user.fi',
      password: 'asdfQEWR1234'
    });
  });

  // test login
  it('should return a user object and bearer token on valid credentials', async () => {
    const user = await postAuthLogin(app, {
      username: 'test@user.fi',
      password: 'asdfQEWR1234'
    });
    token = user.token;
  });

  // test update user
  it('should update user', async () => {
    await putUser(app, token);
  });

  // test get current user based on token
  let owner = 0;
  it('should return current user', async () => {
    const user = await getCurrentUser(app, token);
    owner = user.id;
  });

  // test delete user based on token
  it('should delete current user', async () => {
    await deleteUser(app, token);
  });

  // login as admin
  it('should login as admin', async () => {
    const user = await postAuthLogin(app, {
      username: 'test@test.com',
      password: '1234'
    });
    token = user.token;
  });
  // test get all users
  let userId = 0;
  it('should return array of users', async () => {
    const users: User[] = await getUser(app, token);
    userId = users[0].id!;
  });

  // test get single user
  it('should return single user', async () => {
    await getSingleUser(app, userId, token);
  });
});
