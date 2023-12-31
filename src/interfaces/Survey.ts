import { RowDataPacket } from 'mysql2';
import { HousingCompany } from './HousingCompany';
import { User } from './User';
import { Questionnaire } from './Questionnaire';

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
  questionnaire_id: number | Questionnaire;
  questions_used?: string;
  sections_used?: string;
  result_value?: string;
  result?:
    | 'not enough answers'
    | {
        totalResult: number;
        totalResultValue: String;
        section1ResultValue: String;
        section2ResultValue: String;
        section3ResultValue: String;
      };
}

interface GetSurvey extends RowDataPacket, Survey {}

type PostSurvey = Omit<Survey, 'id'>;

type PutSurvey = Partial<PostSurvey>;

export { Survey, GetSurvey, PostSurvey, PutSurvey };
