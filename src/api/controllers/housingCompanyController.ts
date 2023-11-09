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
import { HousingCompany } from '../../interfaces/HousingCompany';
import CustomError from '../../classes/CustomError';
import MessageResponse from '../../interfaces/MessageResponse';
import { User } from '../../interfaces/User';
import { postAddress } from '../models/addressModel';
import { getCityIdByName, postCity } from '../models/cityModel';
import { getPostcodeIdByCode, postPostcode } from '../models/postcodeModel';
import {
  getStreetIdByNameAndPostcodeID,
  postStreet
} from '../models/streetModel';

const housingCompanyListGet = async (
  req: Request,
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
  try {
    if ((req.user as User).role !== 'admin') {
      throw new CustomError('Unauthorized', 401);
    }
    const housingCompanies = await getAllHousingCompanies();

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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    throw new CustomError(messages, 400);
  }

  const id = parseInt(req.params.id);
  try {
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    throw new CustomError(messages, 400);
  }
  const id = parseInt(req.params.id);
  try {
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    throw new CustomError(messages, 400);
  }
  const id = (req.user as User).id;
  try {
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    throw new CustomError(messages, 400);
  }
  const postcodeID = parseInt(req.params.id);
  try {
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    throw new CustomError(messages, 400);
  }
  const street = parseInt(req.params.id);
  try {
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
  req: Request<
    {},
    {},
    {
      name: string;
      apartment_count: number;
      user_id: number;
      address_number: string;
      street_name: string;
      postcode_name: string;
      postcode: string;
      city_name: string;
    }
  >,
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
  try {
    const user = req.user as User;
    req.body.user_id = user.id;

    let city;
    try {
      city = await getCityIdByName(req.body.city_name);
    } catch (error) {}

    if (!city) {
      city = await postCity({ name: req.body.city_name });
    }

    let postcode;
    try {
      postcode = await getPostcodeIdByCode(req.body.postcode);
    } catch (error) {}
    if (!postcode) {
      postcode = await postPostcode({
        name: req.body.postcode_name,
        code: req.body.postcode,
        city_id: city
      });
    }

    let street;
    try {
      street = await getStreetIdByNameAndPostcodeID(
        req.body.street_name,
        postcode
      );
    } catch (error) {}
    if (!street) {
      street = await postStreet({
        name: req.body.street_name,
        postcode_id: postcode
      });
    }

    const address = await postAddress({
      number: req.body.address_number,
      street_id: street
    });
    const result = await postHousingCompany({
      name: req.body.name,
      apartment_count: req.body.apartment_count,
      address_id: address,
      user_id: user.id
    });
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    throw new CustomError(messages, 400);
  }
  try {
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
