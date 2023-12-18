import { RowDataPacket } from 'mysql2';

import { Section } from './Section';
import { Questionnaire } from './Questionnaire';

interface UserSectionSummary {
  id: number;
  result: string;
  summary: string;
  section_id: number | Section;
  questionnaire_id: number | Questionnaire;
}

interface GetUserSectionSummary extends RowDataPacket, UserSectionSummary {}

type PostUserSectionSummary = Omit<UserSectionSummary, 'id'>;

type PutUserSectionSummary = Partial<PostUserSectionSummary>;

export {
  UserSectionSummary,
  GetUserSectionSummary,
  PostUserSectionSummary,
  PutUserSectionSummary
};
