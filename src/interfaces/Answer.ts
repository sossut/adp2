import { RowDataPacket } from 'mysql2';
import { Question } from './Question';
import { Survey } from './Survey';

interface Answer {
  id: number;
  answer: number;
  question_id: Question | number;
  survey_id: Survey | number;
  survey_key?: string;
  data?: Array<{ question_id: number; answer: number; survey_id: number }>;
  // data: any;
}

interface GetAnswer extends RowDataPacket, Answer {}

type PostAnswer = Omit<Answer, 'id'>;

type PutAnswer = Partial<PostAnswer>;

export { Answer, GetAnswer, PostAnswer, PutAnswer };
