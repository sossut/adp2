import { RowDataPacket } from 'mysql2';

import { Address } from './Address';

import { User } from './User';
import { Survey } from './Survey';
import { City } from './City';
import { Postcode } from './Postcode';

interface HousingCompany {
  id: number;
  name: string;
  apartment_count: number;
  address_id: number | Address;
  user_id: number | User;
  location: string;
  address_number?: string;
  street_name?: string;
  street_id?: number;
  postcode_id?: number;
  city_id?: number;
  postcode_name?: string;
  city_name?: string;
  postcode?: string | Postcode;
  survey_result?: Object;
  survey?: Survey;
  city?: City;
  address?: Address;
}

interface GetHousingCompany extends RowDataPacket, HousingCompany {}

type PostHousingCompany = Omit<HousingCompany, 'id'>;

type PutHousingCompany = Partial<PostHousingCompany>;

export {
  HousingCompany,
  GetHousingCompany,
  PostHousingCompany,
  PutHousingCompany
};
