import { RowDataPacket } from 'mysql2';

import { Question } from './Question';
import { Choice } from './Choice';

interface QuestionChoice {
  id: number;
  question_id: Question | number;
  choice_id: Choice | number;
}

interface GetQuestionChoice extends RowDataPacket, QuestionChoice {}

type PostQuestionChoice = Omit<QuestionChoice, 'id'>;

type PutQuestionChoice = Partial<PostQuestionChoice>;

export {
  QuestionChoice,
  GetQuestionChoice,
  PostQuestionChoice,
  PutQuestionChoice
};
