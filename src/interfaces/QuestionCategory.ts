import { RowDataPacket } from 'mysql2';

interface QuestionCategory {
  id: number;
  category: string;
}

interface GetQuestionCategory extends RowDataPacket, QuestionCategory {}

type PostQuestionCategory = Omit<QuestionCategory, 'id'>;

type PutQuestionCategory = Partial<PostQuestionCategory>;

export {
  QuestionCategory,
  GetQuestionCategory,
  PostQuestionCategory,
  PutQuestionCategory
};
