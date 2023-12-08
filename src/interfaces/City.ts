import { RowDataPacket } from 'mysql2';

interface City {
  id: number;
  name: string;
  city_id?: number;
}

interface GetCity extends RowDataPacket, City {}

type PostCity = Omit<City, 'id'>;

type PutCity = Partial<PostCity>;

export { City, GetCity, PostCity, PutCity };
