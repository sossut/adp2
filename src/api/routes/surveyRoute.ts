import express from 'express';
import {
  surveyDelete,
  surveyGet,
  surveyGetByKey,
  surveyListGet,
  surveyPost,
  surveyPut,
  surveyListByHousingCompanyGet
} from '../controllers/surveyController';
import { body, param } from 'express-validator';
import passport from 'passport';

const router = express.Router();

router
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), surveyListGet)
  .post(
    passport.authenticate('jwt', { session: false }),
    body('start_date').isDate().optional().escape(),
    body('end_date').isDate().optional().escape(),
    body('min_responses').isNumeric().optional().escape(),
    body('max_responses').isNumeric().optional().escape(),
    body('survey_status').isString().optional().escape(),
    body('survey_key').isString().notEmpty().escape(),
    body('housing_company_id').isNumeric().notEmpty().escape(),
    surveyPost
  );

router
  .route('/:id')
  .get(
    passport.authenticate('jwt', { session: false }),
    param('id').isNumeric(),
    surveyGet
  )
  .put(
    passport.authenticate('jwt', { session: false }),
    param('id').isNumeric(),
    surveyPut
  )
  .delete(
    passport.authenticate('jwt', { session: false }),
    param('id').isNumeric(),
    surveyDelete
  );

router
  .route('/key/:key')
  .get(param('key').isString().notEmpty().escape(), surveyGetByKey);

router
  .route('/housing-company/:id')
  .get(
    passport.authenticate('jwt', { session: false }),
    param('id').isNumeric(),
    surveyListByHousingCompanyGet
  );

export default router;
