import dayjs from 'dayjs/esm';

import { IDepartments, NewDepartments } from './departments.model';

export const sampleWithRequiredData: IDepartments = {
  id: 7134,
};

export const sampleWithPartialData: IDepartments = {
  id: 7070,
  createdDate: dayjs('2026-07-04T03:30'),
};

export const sampleWithFullData: IDepartments = {
  id: 58,
  name: 'pfft gracefully finished',
  description: 'miserably',
  createdBy: 'safely healthily',
  createdDate: dayjs('2026-07-04T01:00'),
  lastModifiedBy: 'sneak',
  lastModifiedDate: dayjs('2026-07-03T22:05'),
};

export const sampleWithNewData: NewDepartments = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
