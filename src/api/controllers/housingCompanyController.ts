import { validationResult } from 'express-validator';
import {
  getAllHousingCompanies,
  getHousingCompany,
  postHousingCompany,
  putHousingCompany,
  deleteHousingCompany,
  getHousingCompaniesByUser,
  getHousingCompaniesByPostcode,
  getHousingCompaniesByCity,
  getHousingCompaniesByStreet
} from '../models/housingCompanyModel';
import { Request, Response, NextFunction } from 'express';
import {
  HousingCompany,
  PostHousingCompany
} from '../../interfaces/HousingCompany';
import CustomError from '../../classes/CustomError';
import MessageResponse from '../../interfaces/MessageResponse';
import { User } from '../../interfaces/User';
import {
  getAddressByPostcodeAndStreetAndNumber,
  postAddress
} from '../models/addressModel';
import { getCityIdByName, postCity } from '../models/cityModel';
import { getPostcodeIdByCode, postPostcode } from '../models/postcodeModel';
import {
  getStreetIdByNameAndPostcodeID,
  postStreet
} from '../models/streetModel';
import { getSurveysByHousingCompanyByTime } from '../models/surveyModel';
import { getSurveyResultsAndCount } from '../../utils/utility';
import fetch from 'node-fetch';
const housingCompanyListGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }

    const housingCompanies = await getAllHousingCompanies(
      (req.user as User).id,
      (req.user as User).role
    );

    try {
      await Promise.all(
        housingCompanies.map(async (hc) => {
          let surveys;
          try {
            surveys = await getSurveysByHousingCompanyByTime(
              hc.id,
              (req.user as User).id,
              (req.user as User).role
            );
            let foundResult = false;
            await Promise.all(
              surveys.map(async (survey) => {
                if (!foundResult) {
                  if (survey.result != 'not enough answers') {
                    const result = await getSurveyResultsAndCount(survey.id);
                    const { totalResultValue } = result as any;
                    hc.survey_result = totalResultValue;
                    foundResult = true;
                  }
                }
              })
            );
          } catch (error) {}
        })
      );
    } catch (error) {}

    res.json(housingCompanies);
  } catch (error) {
    next(error);
  }
};

const housingCompanyGet = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }

    const id = parseInt(req.params.id);
    const housingCompany = await getHousingCompany(
      id,
      (req.user as User).id,
      (req.user as User).role
    );
    res.json(housingCompany);
  } catch (error) {
    next(error);
  }
};

const housingCompaniesByUserGet = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }
    const id = parseInt(req.params.id);
    if ((req.user as User).role !== 'admin') {
      throw new CustomError('Unauthorized', 401);
    }
    const housingCompanies = await getHousingCompaniesByUser(id);
    res.json(housingCompanies);
  } catch (error) {
    next(error);
  }
};

const housingCompaniesByCurrentUserGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }
    const id = (req.user as User).id;
    const housingCompanies = await getHousingCompaniesByUser(id);
    res.json(housingCompanies);
  } catch (error) {
    next(error);
  }
};

const housingCompaniesByPostcodeGet = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }
    const postcodeID = parseInt(req.params.id);
    if ((req.user as User).role !== 'admin') {
      throw new CustomError('Unauthorized', 401);
    }
    const housingCompanies = await getHousingCompaniesByPostcode(postcodeID);
    res.json(housingCompanies);
  } catch (error) {
    next(error);
  }
};

//TODO role check and user_id
const housingCompaniesByCityGet = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    throw new CustomError(messages, 400);
  }
  if ((req.user as User).role !== 'admin') {
    throw new CustomError('Unauthorized', 401);
  }
  const city = parseInt(req.params.id);
  try {
    const housingCompanies = await getHousingCompaniesByCity(city);
    res.json(housingCompanies);
  } catch (error) {
    next(error);
  }
};

const housingCompaniesByStreetGet = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }
    const street = parseInt(req.params.id);
    if ((req.user as User).role !== 'admin') {
      throw new CustomError('Unauthorized', 401);
    }
    const housingCompanies = await getHousingCompaniesByStreet(street);
    res.json(housingCompanies);
  } catch (error) {
    next(error);
  }
};

const housingCompanyPost = async (
  req: Request<{}, {}, PostHousingCompany>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }
    const user = req.user as User;
    req.body.user_id = user.id;

    let city;
    try {
      if (!req.body.city_id) {
        city = await getCityIdByName(req.body.city_name as string);
      } else {
        city = req.body.city_id;
      }
    } catch (error) {}

    if (!city) {
      city = await postCity({ name: req.body.city_name as string });
    }

    let postcode;
    try {
      if (!req.body.postcode_id) {
        postcode = await getPostcodeIdByCode(req.body.postcode as string);
      } else {
        postcode = req.body.postcode_id;
      }
    } catch (error) {}
    if (!postcode) {
      postcode = await postPostcode({
        name: req.body.postcode_name as string,
        code: req.body.postcode as string,
        city_id: city
      });
    }

    let street;
    try {
      if (!req.body.street_id) {
        street = await getStreetIdByNameAndPostcodeID(
          req.body.street_name as string,
          postcode
        );
      } else {
        street = req.body.street_id;
      }
    } catch (error) {}
    if (!street) {
      street = await postStreet({
        name: req.body.street_name as string,
        postcode_id: postcode
      });
    }

    let address;
    try {
      address = await getAddressByPostcodeAndStreetAndNumber(
        req.body.postcode as string,
        req.body.street_name as string,
        req.body.address_number as string
      );
    } catch (error) {}
    if (!address) {
      address = await postAddress({
        number: req.body.address_number as string,
        street_id: street
      });
    } else {
      address = address.id;
    }
    const streetName = req.body.street_name?.trim() as string;
    const addressNumber = req.body.address_number?.trim() as string;
    const cityName = req.body.city_name?.trim() as string;

    const response = await fetch(
      `https://paikkatietohaku.api.hel.fi/v1/address/?municipality=${cityName}&streetname=${streetName}&streetnumber=${addressNumber}`,
      {
        headers: {
          Authorization: 'Bearer ' + process.env.PAIKKATIETO_API_KEY
        }
      }
    );

    const locationJson = (await response.json()) as any;
    let location, hc;
    try {
      location = JSON.stringify(locationJson.results[0].location.coordinates);
    } catch (error) {
      location = null;
    }
    hc = {
      name: req.body.name,
      apartment_count: req.body.apartment_count,
      address_id: address,
      user_id: user.id,
      location: location
    };

    const result = await postHousingCompany(hc as PostHousingCompany);
    if (result) {
      const message: MessageResponse = {
        message: 'housing company added',
        id: result
      };
      res.json(message);
    }
  } catch (error) {
    next(error);
  }
};

const housingCompanyPut = async (
  req: Request<{ id: string }, {}, HousingCompany>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }
    const housingCompany = req.body;
    const id = parseInt(req.params.id);
    const result = await putHousingCompany(
      housingCompany,
      id,
      (req.user as User).id,
      (req.user as User).role
    );
    if (result) {
      res.json({
        message: 'housing company updated',
        id: result
      });
    }
  } catch (error) {
    next(error);
  }
};

const housingCompanyDelete = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }
    const result = await deleteHousingCompany(
      parseInt(req.params.id),
      (req.user as User).id,
      (req.user as User).role
    );
    if (result) {
      const message: MessageResponse = {
        message: 'housing company deleted',
        id: parseInt(req.params.id)
      };
      res.json(message);
    }
  } catch (error) {
    next(error);
  }
};

export {
  housingCompanyListGet,
  housingCompanyGet,
  housingCompaniesByUserGet,
  housingCompaniesByCurrentUserGet,
  housingCompaniesByPostcodeGet,
  housingCompaniesByCityGet,
  housingCompaniesByStreetGet,
  housingCompanyPost,
  housingCompanyPut,
  housingCompanyDelete
};
