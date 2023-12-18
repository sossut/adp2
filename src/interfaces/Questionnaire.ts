import { RowDataPacket } from 'mysql2';
import { Survey } from './Survey';
import { Section } from './Section';

interface Questionnaire {
  id: number;
  date_time: Date;
  name: string;
  description: string;
  questionnaire_status: string;
  end_date: Date;
  survey?: Survey | string;
  survey_id?: number;
  questions?: string;
  sections?: Array<Section>;
}

interface GetQuestionnaire extends RowDataPacket, Questionnaire {}

type PostQuestionnaire = Omit<Questionnaire, 'id'>;

type PutQuestionnaire = Partial<PostQuestionnaire>;

export { Questionnaire, GetQuestionnaire, PostQuestionnaire, PutQuestionnaire };
