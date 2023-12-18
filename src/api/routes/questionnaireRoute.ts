import express from 'express';
import {
  questionnaireListGet,
  questionnaireGet,
  questionnairePost,
  questionnairePut,
  questionnaireDelete,
  questionnaireGetBySurveyKey
} from '../controllers/questionnaireController';
import passport from 'passport';
import { body } from 'express-validator';

const router = express.Router();

router
  .route('/')
  .get(questionnaireListGet)
  .post(
    passport.authenticate('jwt', { session: false }),
    body('name').isString().notEmpty().escape(),
    body('description').isString().optional().escape(),
    body('end_date').isDate().optional().escape(),
    body('questionnaire_status').isString().optional().escape(),
    questionnairePost
  );

router
  .route('/survey/:key')
  .get(
    passport.authenticate('jwt', { session: false }),
    questionnaireGetBySurveyKey
  );

router
  .route('/:id')
  .get(questionnaireGet)
  .put(questionnairePut)
  .delete(questionnaireDelete);

export default router;
