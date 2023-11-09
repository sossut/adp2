import { RowDataPacket } from 'mysql2';
import { HousingCompany } from './HousingCompany';
import { User } from './User';

interface Survey {
  id: number;
  start_date: Date | null;
  end_date: Date | null;
  min_responses: number | null;
  max_responses: number | null;
  survey_status: 'open' | 'closed';
  user_id: User | number;
  survey_key: string;
  housing_company_id: HousingCompany | number;
}

interface GetSurvey extends RowDataPacket, Survey {}

type PostSurvey = Omit<Survey, 'id'>;

type PutSurvey = Partial<PostSurvey>;

export { Survey, GetSurvey, PostSurvey, PutSurvey };
