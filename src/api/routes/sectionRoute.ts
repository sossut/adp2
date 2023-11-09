import express from 'express';
import { body, param } from 'express-validator';
import {
  sectionDelete,
  sectionGet,
  sectionListGet,
  sectionPost,
  sectionPut
} from '../controllers/sectionController';

import passport from 'passport';

const router = express.Router();

router
  .route('/')
  .get(sectionListGet)
  .post(
    passport.authenticate('jwt', { session: false }),
    body('section_text')
      .isString()
      .isLength({ min: 1, max: 255 })
      .escape()
      .notEmpty(),
    sectionPost
  );

router
  .route('/:id')
  .get(param('id').isNumeric(), sectionGet)
  .put(
    passport.authenticate('jwt', { session: false }),
    param('id').isNumeric(),
    sectionPut
  )
  .delete(
    passport.authenticate('jwt', { session: false }),
    param('id').isNumeric(),
    sectionDelete
  );

export default router;
