import request from 'supertest';
import { City } from '../src/interfaces/City';

const getCities = (url: string | Function, token: string): Promise<City[]> => {
  return new Promise((resolve, reject) => {
    request(url)
      .get('/api/v1/city')
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const cities: City[] = response.body;
          cities.forEach((city) => {
            expect(city).toHaveProperty('id');
            expect(city).toHaveProperty('name');
            // Add more properties as per your City model
          });
          resolve(cities);
        }
      });
  });
};

const getSingleCity = (
  url: string | Function,
  id: number,
  token: string
): Promise<City> => {
  return new Promise((resolve, reject) => {
    request(url)
      .get('/api/v1/city/' + id)
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const city = response.body;
          expect(city).toHaveProperty('id');
          expect(city).toHaveProperty('name');
          // Add more properties as per your City model
          resolve(response.body);
        }
      });
  });
};

const postCity = (
  url: string | Function,
  city: Omit<City, 'id'>
): Promise<City> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/api/v1/city/')
      .set('Content-type', 'application/json')
      .send(city)
      .expect('Content-Type', /json/)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const newCity = response.body;
          expect(newCity).toHaveProperty('id');
          expect(newCity).toHaveProperty('name');
          // Add more properties as per your City model
          resolve(response.body);
        }
      });
  });
};

const putCity = (
  url: string | Function,
  id: number,
  city: Partial<City>,
  token: string
): Promise<City> => {
  return new Promise((resolve, reject) => {
    request(url)
      .put('/api/v1/city/' + id)
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send(city)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const updatedCity = response.body;
          expect(updatedCity).toHaveProperty('id');
          expect(updatedCity).toHaveProperty('name');
          // Add more properties as per your City model
          resolve(response.body);
        }
      });
  });
};

const deleteCity = (
  url: string | Function,
  id: number,
  token: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    request(url)
      .delete('/api/v1/city/' + id)
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response.body);
        }
      });
  });
};

export { getCities, getSingleCity, postCity, putCity, deleteCity };
