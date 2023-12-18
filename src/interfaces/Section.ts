import { RowDataPacket } from 'mysql2';
import { Question } from './Question';

interface Section {
  id: number;
  section_text: string;
  active: 'true' | 'false';
  description?: string;
  questions?: Array<Question>;
}

interface GetSection extends RowDataPacket, Section {}

type PostSection = Omit<Section, 'id'>;

type PutSection = Partial<PostSection>;

export { Section, GetSection, PostSection, PutSection };
