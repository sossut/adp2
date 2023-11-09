import { RowDataPacket } from 'mysql2';

interface Section {
  id: number;
  section_text: string;
  active: 'true' | 'false';
}

interface GetSection extends RowDataPacket, Section {}

type PostSection = Omit<Section, 'id'>;

type PutSection = Partial<PostSection>;

export { Section, GetSection, PostSection, PutSection };
