import dayjs from 'dayjs/esm';

import { IStrategies, NewStrategies } from './strategies.model';

export const sampleWithRequiredData: IStrategies = {
  id: 29756,
};

export const sampleWithPartialData: IStrategies = {
  id: 11457,
  createdBy: 'ugh',
  lastModifiedBy: 'gah',
  lastModifiedDate: dayjs('2026-07-02T09:11'),
};

export const sampleWithFullData: IStrategies = {
  id: 18933,
  name: 'simple whose eek',
  description: '../fake-data/blob/hipster.txt',
  createdBy: 'before unfinished deceivingly',
  createdDate: dayjs('2026-07-01T23:24'),
  lastModifiedBy: 'interior',
  lastModifiedDate: dayjs('2026-07-02T11:39'),
};

export const sampleWithNewData: NewStrategies = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
