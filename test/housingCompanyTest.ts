import request from 'supertest';
import { HousingCompany } from '../src/interfaces/HousingCompany';

const getHousingCompanies = (
  url: string | Function,
  token: string
): Promise<HousingCompany[]> => {
  return new Promise((resolve, reject) => {
    request(url)
      .get('/api/v1/housing-company')
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const housingCompanies: HousingCompany[] = response.body;
          housingCompanies.forEach((housingCompany) => {
            expect(housingCompany).toHaveProperty('id');
            expect(housingCompany).toHaveProperty('company_name');
            // Add more properties as per your HousingCompany model
          });
          resolve(housingCompanies);
        }
      });
  });
};

const getSingleHousingCompany = (
  url: string | Function,
  id: number,
  token: string
): Promise<HousingCompany> => {
  return new Promise((resolve, reject) => {
    request(url)
      .get('/api/v1/housing-company/' + id)
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const housingCompany = response.body;
          expect(housingCompany).toHaveProperty('id');
          expect(housingCompany).toHaveProperty('company_name');
          // Add more properties as per your HousingCompany model
          resolve(response.body);
        }
      });
  });
};

const postHousingCompany = (
  url: string | Function,
  housingCompany: Omit<HousingCompany, 'id'>
): Promise<HousingCompany> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/api/v1/housing-company/')
      .set('Content-type', 'application/json')
      .send(housingCompany)
      .expect('Content-Type', /json/)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const newHousingCompany = response.body;
          expect(newHousingCompany).toHaveProperty('id');
          expect(newHousingCompany).toHaveProperty('company_name');
          // Add more properties as per your HousingCompany model
          resolve(response.body);
        }
      });
  });
};

const putHousingCompany = (
  url: string | Function,
  id: number,
  housingCompany: Partial<HousingCompany>,
  token: string
): Promise<HousingCompany> => {
  return new Promise((resolve, reject) => {
    request(url)
      .put('/api/v1/housing-company/' + id)
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send(housingCompany)
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const updatedHousingCompany = response.body;
          expect(updatedHousingCompany).toHaveProperty('id');
          expect(updatedHousingCompany).toHaveProperty('company_name');
          // Add more properties as per your HousingCompany model
          resolve(response.body);
        }
      });
  });
};

const deleteHousingCompany = (
  url: string | Function,
  id: number,
  token: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    request(url)
      .delete('/api/v1/housing-company/' + id)
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

export {
  getHousingCompanies,
  getSingleHousingCompany,
  postHousingCompany,
  putHousingCompany,
  deleteHousingCompany
};
