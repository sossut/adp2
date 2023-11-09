import { RowDataPacket } from 'mysql2';

interface Choice {
  id: number;
  choice_text: string;
  choice_value: number;
}

interface GetChoice extends RowDataPacket, Choice {}

type PostChoice = Omit<Choice, 'id'>;

type PutChoice = Partial<PostChoice>;

export { Choice, GetChoice, PostChoice, PutChoice };
