import { promisePool } from '../../database/db';
import CustomError from '../../classes/CustomError';
import { ResultSetHeader } from 'mysql2';
import {
  GetChoice,
  PostChoice,
  PutChoice,
  Choice
} from '../../interfaces/Choice';

const getAllChoices = async (): Promise<Choice[]> => {
  const [rows] = await promisePool.execute<GetChoice[]>(
    `SELECT choices.id, choices.choice_text, choices.choice_value
    FROM choices;`
  );
  if (rows.length === 0) {
    throw new CustomError('No choices found', 404);
  }
  const choices: Choice[] = rows.map((row) => ({
    ...row
  }));
  return choices;
};

const getChoice = async (id: string): Promise<GetChoice> => {
  const [rows] = await promisePool.execute<GetChoice[]>(
    `SELECT choices.id, choices.choice_text, choices.choice_value
    FROM choices
    WHERE choices.id = ?;`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError('No choices found', 404);
  }
  return rows[0];
};

const getChoicesByValue = async (value: string): Promise<GetChoice[]> => {
  const [rows] = await promisePool.execute<GetChoice[]>(
    `SELECT choices.id, choices.choice_text, choices.choice_value
    FROM choices
    WHERE choices.choice_value = ?;`,
    [value]
  );
  if (rows.length === 0) {
    throw new CustomError('No choices found', 404);
  }
  return rows;
};

const postChoice = async (choice: PostChoice) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    'INSERT INTO choices (choice_text, choice_value) VALUES (?, ?);',
    [choice.choice_text, choice.choice_value]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Choice not created', 400);
  }
  return headers.insertId;
};

const putChoice = async (data: PutChoice, id: number) => {
  const sql = promisePool.format('UPDATE choices SET ? WHERE id = ?;', [
    data,
    id
  ]);
  const [headers] = await promisePool.execute<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('Choice not updated', 400);
  }
  return headers.affectedRows;
};

const deleteChoice = async (id: number) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    'DELETE FROM choices WHERE id = ?;',
    [id]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Choice not deleted', 400);
  }
  return headers.affectedRows;
};

export {
  getAllChoices,
  getChoice,
  getChoicesByValue,
  postChoice,
  putChoice,
  deleteChoice
};
