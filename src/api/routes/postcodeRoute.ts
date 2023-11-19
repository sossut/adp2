import express from 'express';
import {
  postcodeListGet,
  postcodeGet,
  postcodePost,
  postcodePut,
  postcodeDelete,
  postcodeListGetWhereCurrentUserHasHousingCompanies
} from '../controllers/postcodeController';
import { body, param } from 'express-validator';
import passport from 'passport';

const router = express.Router();

router
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), postcodeListGet)
  .post(
    passport.authenticate('jwt', { session: false }),
    body('code').isString().notEmpty().escape(),
    body('name').isString().notEmpty().escape(),
    body('city_id').isNumeric().notEmpty().escape(),
    postcodePost
  );

router
  .route('/:id')
  .get(
    passport.authenticate('jwt', { session: false }),
    param('id').isNumeric(),
    postcodeGet
  )
  .put(
    passport.authenticate('jwt', { session: false }),
    param('id').isNumeric(),
    postcodePut
  )
  .delete(
    passport.authenticate('jwt', { session: false }),
    param('id').isNumeric(),
    postcodeDelete
  );

router
  .route('/housing-company/user/:id')
  .get(
    passport.authenticate('jwt', { session: false }),
    param('id').isNumeric(),
    postcodeListGetWhereCurrentUserHasHousingCompanies
  );

export default router;
