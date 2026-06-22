import dayjs from 'dayjs/esm';

import { IStrategies, NewStrategies } from './strategies.model';

export const sampleWithRequiredData: IStrategies = {
  id: 31961,
};

export const sampleWithPartialData: IStrategies = {
  id: 13198,
  name: 'kindly dissect except',
  description: 'furthermore',
  createdBy: 'jittery unaccountably',
  createdDate: dayjs('2024-01-03T21:26'),
};

export const sampleWithFullData: IStrategies = {
  id: 19991,
  name: 'while so',
  description: 'rightfully at throughout',
  createdBy: 'cautiously duh',
  createdDate: dayjs('2024-01-03T15:33'),
  lastModifiedBy: 'versus',
  lastModifiedDate: dayjs('2024-01-03T18:25'),
};

export const sampleWithNewData: NewStrategies = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
