import { RowDataPacket } from 'mysql2';
import { Section } from './Section';

interface SectionSummary {
  id: number;
  result: string;
  summary: string;
  section_id: number | Section;
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
