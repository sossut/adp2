import { body, check, param } from 'express-validator';
import express from 'express';
import {
  questionDelete,
  questionGet,
  questionActiveListGet,
  questionListGet,
  questionPost,
  questionPut,
  questionListBySurveyKeyGet
} from '../controllers/questionController';
import passport from 'passport';

const router = express.Router();

router
  .route('/')
  .get(questionListGet)
  .post(
    passport.authenticate('jwt', { session: false }),
    body('question_order').isNumeric().optional().escape(),
    body('question').isString().notEmpty().escape(),
    body('weight').isNumeric().notEmpty().escape(),
    body('section_id').isNumeric().notEmpty().escape(),
    check('choices').isArray().optional(),
    check('choices.*.choice_id').isNumeric().optional().escape(),
    questionPost
  );

router.get('/survey/:key', questionListBySurveyKeyGet);

router.route('/active').get(questionActiveListGet);

router
  .route('/:id')
  .get(param('id').isNumeric(), questionGet)
  .put(passport.authenticate('jwt', { session: false }), questionPut)
  .delete(passport.authenticate('jwt', { session: false }), questionDelete);

export default router;
