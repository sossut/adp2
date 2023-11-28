import { RowDataPacket } from 'mysql2';

import { Survey } from './Survey';

interface SectionsUsedInSurvey {
  id: number;
  sections_used: string;
  survey_id: number | Survey;
}

interface GetSectionsUsedInSurvey extends RowDataPacket, SectionsUsedInSurvey {}

type PostSectionsUsedInSurvey = Omit<SectionsUsedInSurvey, 'id'>;

type PutSectionsUsedInSurvey = Partial<PostSectionsUsedInSurvey>;

export {
  SectionsUsedInSurvey,
  GetSectionsUsedInSurvey,
  PostSectionsUsedInSurvey,
  PutSectionsUsedInSurvey
};
