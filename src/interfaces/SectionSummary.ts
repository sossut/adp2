import { RowDataPacket } from 'mysql2';
import { Section } from './Section';
import { Questionnaire } from './Questionnaire';

interface SectionSummary {
  id: number;
  result: string;
  summary: string;
  section_id: number | Section;
  questionnaire_id: number | Questionnaire;
}

interface GetSectionSummary extends RowDataPacket, SectionSummary {}

type PostSectionSummary = Omit<SectionSummary, 'id'>;

type PutSectionSummary = Partial<PostSectionSummary>;

export {
  SectionSummary,
  GetSectionSummary,
  PostSectionSummary,
  PutSectionSummary
};
