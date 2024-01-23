import dayjs from 'dayjs/esm';

import { IOrg, NewOrg } from './org.model';

export const sampleWithRequiredData: IOrg = {
  id: 32417,
};

export const sampleWithPartialData: IOrg = {
  id: 23991,
  logo: 'cave as overnighter',
  createdBy: 'for',
  lastModifiedBy: 'boo whose toward',
};

export const sampleWithFullData: IOrg = {
  id: 3189,
  name: 'yowza jealously boohoo',
  logo: 'event',
  address: 'over rubric',
  createdBy: 'local accurate psst',
  createdDate: dayjs('2024-01-03T14:54'),
  lastModifiedBy: 'bedeck',
  lastModifiedDate: dayjs('2024-01-03T17:39'),
};

export const sampleWithNewData: NewOrg = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
