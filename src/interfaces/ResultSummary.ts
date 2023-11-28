import { RowDataPacket } from 'mysql2';

interface ResultSummary {
  id: number;
  summary: string;
  recommendation: string;
}

interface GetResultSummary extends RowDataPacket, ResultSummary {}

type PostResultSummary = Omit<ResultSummary, 'id'>;

type PutResultSummary = Partial<PostResultSummary>;

export { ResultSummary, GetResultSummary, PostResultSummary, PutResultSummary };
