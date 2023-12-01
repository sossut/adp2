import { RowDataPacket } from 'mysql2';

import { Section } from './Section';

interface UserSectionSummary {
  id: number;
  result: string;
  summary: string;
  section_id: number | Section;
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
