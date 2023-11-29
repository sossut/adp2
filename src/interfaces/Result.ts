import { RowDataPacket } from 'mysql2';

import { Survey } from './Survey';
import { ResultSummary } from './ResultSummary';

interface Result {
  id: number;
  filename: string;
  date_time: Date;
  survey_id: Survey | number;
  result_summary_id: number | ResultSummary;
  answer_count: number;
}

interface GetResult extends RowDataPacket, Result {}

type PostResult = Omit<Result, 'id'>;

type PutResult = Partial<PostResult>;

export { Result, GetResult, PostResult, PutResult };
