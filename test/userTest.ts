import request from 'supertest';

import ErrorResponse from '../src/interfaces/ErrorResponse';
import { User } from '../src/interfaces/User';

interface UserWithToken {
  user: User;
  token: string;
}

const getUser = (url: string | Function, token: string): Promise<User[]> => {
  return new Promise((resolve, reject) => {
    request(url)
      .get('/api/v1/user')
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const users: User[] = response.body;
          users.forEach((user) => {
            expect(user).toHaveProperty('id');
            expect(user).toHaveProperty('username');
            expect(user).toHaveProperty('email');
            expect(user).toHaveProperty('role');
          });
          resolve(users);
        }
      });
  });
};

const getSingleUser = (
  url: string | Function,
  id: number,
  token: string
): Promise<User> => {
  return new Promise((resolve, reject) => {
    request(url)
      .get('/api/v1/user/' + id)
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const user = response.body;
          expect(user).toHaveProperty('id');
          expect(user).toHaveProperty('username');
          expect(user).toHaveProperty('email');
          expect(user).toHaveProperty('role');
          resolve(response.body);
        }
      });
  });
};

const postUser = (
  url: string | Function,
  user: Omit<User, 'id' | 'role'>
): Promise<UserWithToken> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/api/v1/user/')
      .set('Content-type', 'application/json')
      .send(user)
      .expect('Content-Type', /json/)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          expect(response.body).toHaveProperty('message');
          expect(response.body).toHaveProperty('id');
          resolve(response.body);
        }
      });
  });
};

const putUser = (url: string | Function, token: string) => {
  return new Promise((resolve, reject) => {
    request(url)
      .put('/api/v1/user/')
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        username: 'Test User ' + new Date().toISOString()
      })
      .expect('Content-Type', /json/)
      .expect(200, { message: 'user updated' }, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response.body);
        }
      });
  });
};

const getCurrentUser = (
  url: string | Function,
  token: string
): Promise<User> => {
  return new Promise((resolve, reject) => {
    request(url)
      .get('/api/v1/user/token')
      .set('Authorization', 'Bearer ' + token)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const user = response.body;
          expect(user).toHaveProperty('id');
          expect(user).toHaveProperty('username');
          expect(user).toHaveProperty('email');
          expect(user).toHaveProperty('role');
          resolve(response.body);
        }
      });
  });
};

const postAuthLogin = (
  url: string | Function,
  user: { username: string; password: string }
): Promise<UserWithToken> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/api/v1/auth/login')
      .send(user)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          expect(response.body).toHaveProperty('user');
          expect(response.body).toHaveProperty('token');
          // eslint-disable-next-line @typescript-eslint/no-shadow
          const user: User = response.body.user;
          expect(user).toHaveProperty('username');
          expect(user).toHaveProperty('email');
          expect(user).toHaveProperty('role');
          expect(user).toHaveProperty('id');
          resolve(response.body);
        }
      });
  });
};

const postAuthLoginError = (url: string | Function): Promise<ErrorResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/api/v1/auth/login')
      .send({
        username: 'wrong@example.com',
        password: 'wrongpassword'
      })
      .expect(401, (err, response) => {
        if (err) {
          reject(err);
        } else {
          expect(response.body).toHaveProperty('message');
          expect(response.body).toHaveProperty('stack');
          resolve(response.body);
        }
      });
  });
};

const deleteUser = (
  url: string | Function,
  token: string
): Promise<ErrorResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .delete('/api/v1/user')
      .set('Authorization', 'Bearer ' + token)
      .expect(200, { message: 'user deleted' }, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response.body);
        }
      });
  });
};

export {
  getUser,
  getSingleUser,
  getCurrentUser,
  postUser,
  putUser,
  postAuthLogin,
  postAuthLoginError,
  deleteUser
};
