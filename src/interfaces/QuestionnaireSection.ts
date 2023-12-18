import { RowDataPacket } from 'mysql2';

import { Section } from './Section';
import { Questionnaire } from './Questionnaire';

interface QuestionnaireSection {
  id: number;
  section_id: Section | number;
  questionnaire_id: Questionnaire | number;
}

interface GetQuestionnaireSection extends RowDataPacket, QuestionnaireSection {}

type PostQuestionnaireSection = Omit<QuestionnaireSection, 'id'>;

type PutQuestionnaireSection = Partial<PostQuestionnaireSection>;

export {
  QuestionnaireSection,
  GetQuestionnaireSection,
  PostQuestionnaireSection,
  PutQuestionnaireSection
};
