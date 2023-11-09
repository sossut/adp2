import { RowDataPacket } from 'mysql2';
import { Postcode } from './Postcode';


interface Street {
  id: number;
  name: string;
  postcode_id: number | Postcode;
}

interface GetStreet extends RowDataPacket, Street {}

type PostStreet = Omit<Street, 'id'>;

type PutStreet = Partial<PostStreet>;

export { Street, GetStreet, PostStreet, PutStreet };