import { RowDataPacket } from 'mysql2';
import { City } from './City';

interface Postcode {
  id: number;
  code: string;
  city_id: City | number;
  name: string;
}

interface GetPostcode extends RowDataPacket, Postcode {}

type PostPostcode = Omit<Postcode, 'id'>;

type PutPostcode = Partial<PostPostcode>;

export { Postcode, GetPostcode, PostPostcode, PutPostcode };
