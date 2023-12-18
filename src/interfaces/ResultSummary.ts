import { RowDataPacket } from 'mysql2';
import { Questionnaire } from './Questionnaire';

interface ResultSummary {
  id: number;
  summary: string;
  recommendation: string;
  questionnaire_id: number | Questionnaire;
  section_one: string;
  section_two: string;
  section_three: string;
}

interface GetResultSummary extends RowDataPacket, ResultSummary {}

type PostResultSummary = Omit<ResultSummary, 'id'>;

type PutResultSummary = Partial<PostResultSummary>;

export { ResultSummary, GetResultSummary, PostResultSummary, PutResultSummary };
