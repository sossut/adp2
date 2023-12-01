import { RowDataPacket } from 'mysql2';
import { Section } from './Section';
import { Choice } from './Choice';
import { QuestionCategory } from './QuestionCategory';

interface Question {
  id: number;
  question_order: number;
  question: string;
  weight: number;
  active: 'true' | 'false';
  section_id: number | Section;
  section_text?: string;
  choices?: Array<{
    question_id?: number | Question;
    choice_id: number | Choice;
  }>;
  question_category_id: number | QuestionCategory;
}

interface GetQuestion extends RowDataPacket, Question {}

type PostQuestion = Omit<Question, 'id'>;

type PutQuestion = Partial<PostQuestion>;

export { Question, GetQuestion, PostQuestion, PutQuestion };
