import { RowDataPacket } from 'mysql2';
import { Street } from './Street';

interface Address {
  id: number;
  number: string;
  street_id: number | Street;
}

interface GetAddress extends RowDataPacket, Address {}

type PostAddress = Omit<Address, 'id'>;

type PutAddress = Partial<PostAddress>;

export { Address, GetAddress, PostAddress, PutAddress };