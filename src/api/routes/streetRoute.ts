import express from 'express';
import {
  streetListGet,
  streetGet,
  streetPost,
  streetPut,
  streetDelete
} from '../controllers/streetController';
import { body, param } from 'express-validator';
import passport from 'passport';

const router = express.Router();

router
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), streetListGet)
  .post(
    passport.authenticate('jwt', { session: false }),
    body('name').isString().isLength({ min: 1, max: 255 }).notEmpty().escape(),
    body('postcode_id').isNumeric().notEmpty().escape(),
    streetPost
  );

router
  .route('/:id')
  .get(
    passport.authenticate('jwt', { session: false }),
    param('id').isNumeric(),
    streetGet
  )
  .put(
    passport.authenticate('jwt', { session: false }),
    param('id').isNumeric(),
    streetPut
  )
  .delete(
    passport.authenticate('jwt', { session: false }),
    param('id').isNumeric(),
    streetDelete
  );

export default router;
