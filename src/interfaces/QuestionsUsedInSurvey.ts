import { RowDataPacket } from 'mysql2';
import { Survey } from './Survey';

interface QuestionsUsedInSurvey {
  id: number;
  questions_used: string;
  survey_id: number | Survey;
  survey?: number | Survey;
}

interface GetQuestionsUsedInSurvey
  extends RowDataPacket,
    QuestionsUsedInSurvey {}

type PostQuestionsUsedInSurvey = Omit<QuestionsUsedInSurvey, 'id'>;

type PutQuestionsUsedInSurvey = Partial<PostQuestionsUsedInSurvey>;

export {
  QuestionsUsedInSurvey,
  GetQuestionsUsedInSurvey,
  PostQuestionsUsedInSurvey,
  PutQuestionsUsedInSurvey
};
