import { RowDataPacket } from 'mysql2';

interface ResultSummary {
  id: number;
  summary: string;
  recommendation: string;
  section_one: string;
  section_two: string;
  section_three: string;
}

interface GetResultSummary extends RowDataPacket, ResultSummary {}

type PostResultSummary = Omit<ResultSummary, 'id'>;

type PutResultSummary = Partial<PostResultSummary>;

export { ResultSummary, GetResultSummary, PostResultSummary, PutResultSummary };
