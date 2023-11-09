import express from 'express';
import {
  answersBySurveyGet,
  answerPost,
  answerDelete,
  answerAllPost
} from '../controllers/answerController';
import { body, param, check } from 'express-validator';
import passport from 'passport';

const router = express.Router();

router
  .route('/')
  .post(
    body('survey_key').isString().notEmpty().escape(),
    body('question_id').isNumeric().notEmpty().escape(),
    body('answer').isNumeric().notEmpty().escape(),
    answerPost
  );
router
  .route('/all/')
  .post(
    check('data').isArray().notEmpty(),
    check('data.*.question_id').isNumeric().notEmpty().escape(),
    check('data.*.answer').isNumeric().notEmpty().escape(),
    check('survey_key').isString().notEmpty().escape(),
    answerAllPost
  );

router
  .route('/:id')
  .delete(
    passport.authenticate('jwt', { session: false }),
    param('id').isNumeric(),
    answerDelete
  );

router
  .route('/survey/:id')
  .get(
    passport.authenticate('jwt', { session: false }),
    param('id').isNumeric(),
    answersBySurveyGet
  );

export default router;
