import express from 'express';
import { body, param } from 'express-validator';
import passport from 'passport';
import {
  cityListGet,
  cityGet,
  cityPost,
  cityPut,
  cityDelete
} from '../controllers/cityController';

const router = express.Router();

router
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), cityListGet)
  .post(
    passport.authenticate('jwt', { session: false }),
    body('name').isString().isLength({ min: 1, max: 255 }).notEmpty().escape(),
    cityPost
  );

router
  .route('/:id')
  .get(
    passport.authenticate('jwt', { session: false }),
    param('id').isNumeric(),
    cityGet
  )
  .put(
    passport.authenticate('jwt', { session: false }),
    param('id').isNumeric(),
    cityPut
  )
  .delete(
    passport.authenticate('jwt', { session: false }),
    param('id').isNumeric(),
    cityDelete
  );

export default router;
