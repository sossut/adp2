import express from 'express';
import {
  housingCompaniesByCityGet,
  housingCompaniesByPostcodeGet,
  housingCompaniesByUserGet,
  housingCompaniesByStreetGet,
  housingCompanyDelete,
  housingCompanyGet,
  housingCompanyListGet,
  housingCompanyPost,
  housingCompanyPut,
  housingCompaniesByCurrentUserGet
} from '../controllers/housingCompanyController';
import { body, param } from 'express-validator';
import passport from 'passport';

const router = express.Router();

router
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), housingCompanyListGet)
  .post(
    passport.authenticate('jwt', { session: false }),
    body('name').isString().isLength({ min: 1, max: 255 }).notEmpty().escape(),
    body('apartment_count')
      .isNumeric()
      .isLength({ min: 1, max: 1000 })
      .notEmpty()
      .escape(),
    body('address_number')
      .isNumeric()
      .isLength({ min: 1, max: 1000 })
      .escape()
      .optional(),
    body('street_name')
      .isString()
      .isLength({ min: 1, max: 255 })
      .optional()
      .escape(),
    body('postcode')
      .isString()
      .isLength({ min: 1, max: 255 })
      .optional()
      .escape(),
    body('postcode_name')
      .isString()
      .isLength({ min: 1, max: 255 })
      .optional()
      .escape(),
    body('city_name')
      .isString()
      .isLength({ min: 1, max: 255 })
      .optional()
      .escape(),
    housingCompanyPost
  );

router
  .route('/:id')
  .get(
    passport.authenticate('jwt', { session: false }),
    param('id').isNumeric(),
    housingCompanyGet
  )
  .put(
    passport.authenticate('jwt', { session: false }),
    param('id').isNumeric(),
    housingCompanyPut
  )
  .delete(
    passport.authenticate('jwt', { session: false }),
    param('id').isNumeric(),
    housingCompanyDelete
  );

router
  .route('/user/current/')
  .get(
    passport.authenticate('jwt', { session: false }),
    housingCompaniesByCurrentUserGet
  );

router
  .route('/user/:id')
  .get(
    passport.authenticate('jwt', { session: false }),
    param('id').isNumeric(),
    housingCompaniesByUserGet
  );

router
  .route('/postcode/:id')
  .get(
    passport.authenticate('jwt', { session: false }),
    param('id').isString().notEmpty().escape(),
    housingCompaniesByPostcodeGet
  );

router
  .route('/city/:id')
  .get(
    passport.authenticate('jwt', { session: false }),
    param('id').isString().notEmpty().escape(),
    housingCompaniesByCityGet
  );

router
  .route('/street/:id')
  .get(
    passport.authenticate('jwt', { session: false }),
    param('id').isString().notEmpty().escape(),
    housingCompaniesByStreetGet
  );
export default router;
