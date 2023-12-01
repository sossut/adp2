import { RowDataPacket } from 'mysql2';
import { QuestionCategory } from './QuestionCategory';

interface QuestionCategorySummary {
  id: number;
  result: string;
  summary: string;
  question_category_id: number | QuestionCategory;
}

interface GetQuestionCategorySummary
  extends RowDataPacket,
    QuestionCategorySummary {}

type PostQuestionCategorySummary = Omit<QuestionCategorySummary, 'id'>;

type PutQuestionCategorySummary = Partial<PostQuestionCategorySummary>;

export {
  QuestionCategorySummary,
  GetQuestionCategorySummary,
  PostQuestionCategorySummary,
  PutQuestionCategorySummary
};
