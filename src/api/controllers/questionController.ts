import { validationResult } from 'express-validator';
import {
  postQuestion,
  deleteQuestion,
  putQuestion,
  getAllQuestions,
  getQuestion,
  getAllActiveQuestions,
  getQuestionOnly,
  getAllQuestionsOnly
} from '../models/questionModel';
import { Request, Response, NextFunction } from 'express';
import CustomError from '../../classes/CustomError';
import { Question, PostQuestion } from '../../interfaces/Question';
import { User } from '../../interfaces/User';
import {
  getQuestionChoiceIdsByQuestionId,
  postQuestionChoice,
  putQuestionChoice
} from '../models/questionChoiceModel';
import {
  PostQuestionChoice,
  PutQuestionChoice
} from '../../interfaces/QuestionChoice';

import { getQuestionnaireBySurveyKey } from '../models/questionnaraireModal';

const questionListGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const questions = await getAllQuestions();
    res.json(questions);
  } catch (error) {
    next(error);
  }
};

const questionActiveListGet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const questions = await getAllActiveQuestions();
    res.json(questions);
  } catch (error) {
    next(error);
  }
};

const questionListBySurveyKeyGet = async (
  req: Request<{ key: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const questionnaire = await getQuestionnaireBySurveyKey(req.params.key);

    res.json(questionnaire);
  } catch (error) {
    next(error);
  }
};

const questionGet = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const question = await getQuestion(req.params.id);
    res.json(question);
  } catch (error) {
    next(error);
  }
};

const questionPost = async (
  req: Request<{}, {}, PostQuestion>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }
    if ((req.user as User).role !== 'admin') {
      throw new CustomError('Unauthorized', 401);
    }

    const result = await postQuestion(req.body);
    const choices = req.body.choices as PostQuestionChoice[];
    choices?.forEach(async (element) => {
      element.question_id = result;
      await postQuestionChoice(element);
    });
    if (result) {
      res.json({
        message: 'question added',
        question_id: result
      });
    } else {
      throw new CustomError('no question inserted', 400);
    }
  } catch (error) {
    next(error);
  }
};

const questionPut = async (
  req: Request<{ id: string }, {}, Question>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }
    if ((req.user as User).role !== 'admin') {
      throw new CustomError('Unauthorized', 401);
    }
    const id = parseInt(req.params.id);
    try {
      const question = await getQuestionOnly(req.params.id);

      const oldQuestionOrder = question.question_order;
      const newQuestionOrder = req.body.question_order;
      const questions = await getAllQuestionsOnly();

      if (newQuestionOrder < oldQuestionOrder) {
        for (let i = newQuestionOrder - 1; i < oldQuestionOrder - 1; i++) {
          const q = questions[i];
          delete q.choices;
          q.question_order += 1;

          await putQuestion(q, q.id);
        }
      } else if (newQuestionOrder > oldQuestionOrder) {
        for (let i = newQuestionOrder - 1; i >= oldQuestionOrder - 1; i--) {
          const q = questions[i];
          delete q.choices;
          q.question_order -= 1;

          await putQuestion(q, q.id);
        }
      }
    } catch (error) {}
    const choices = req.body.choices as PutQuestionChoice[];

    if (choices) {
      const questionsChoises = await getQuestionChoiceIdsByQuestionId(id);

      for (let i = 0; i < questionsChoises.length; i++) {
        const qC = {
          question_id: id,
          choice_id: choices[i].choice_id
        };

        await putQuestionChoice(qC, questionsChoises[i].id);
      }
      delete req.body.choices;
    }
    const question = req.body;
    const result = await putQuestion(question, id);
    if (result) {
      res.json({
        message: 'question updated'
      });
    }
  } catch (error) {
    next(error);
  }
};

const questionDelete = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }
    if ((req.user as User).role !== 'admin') {
      throw new CustomError('Unauthorized', 401);
    }
    const result = await deleteQuestion(parseInt(req.params.id));
    if (result) {
      res.json({
        message: 'question deleted'
      });
    }
  } catch (error) {
    next(error);
  }
};

export {
  questionListGet,
  questionActiveListGet,
  questionListBySurveyKeyGet,
  questionGet,
  questionPost,
  questionPut,
  questionDelete
};
