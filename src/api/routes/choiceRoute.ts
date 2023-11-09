import express from 'express';
import {
  choiceListGet,
  choiceGet,
  choiceGetByValue,
  choicePost,
  choicePut,
  choiceDelete
} from '../controllers/choiceController';
import { body, param } from 'express-validator';
import passport from 'passport';

const router = express.Router();

router
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), choiceListGet)
  .post(
    passport.authenticate('jwt', { session: false }),
    body('choice_value').isInt({ min: 1, max: 3 }).notEmpty().escape(),
    body('choice_text').isString().notEmpty().escape(),
    choicePost
  );

router
  .route('/:id')
  .get(
    // passport.authenticate('jwt', { session: false }),
    param('id').isNumeric(),
    choiceGet
  )
  .put(
    passport.authenticate('jwt', { session: false }),
    param('id').isNumeric(),
    body('choice_value').optional().isInt({ min: 1, max: 3 }).escape(),
    body('choice_text').optional().isString().escape(),
    choicePut
  )
  .delete(
    passport.authenticate('jwt', { session: false }),
    param('id').isNumeric(),
    choiceDelete
  );

router
  .route('/value/:value')
  .get(
    passport.authenticate('jwt', { session: false }),
    param('value').isString().notEmpty().escape(),
    choiceGetByValue
  );

export default router;
