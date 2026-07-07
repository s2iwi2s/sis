import dayjs from 'dayjs/esm';

import { IDepartments, NewDepartments } from './departments.model';

export const sampleWithRequiredData: IDepartments = {
  id: 7134,
};

export const sampleWithPartialData: IDepartments = {
  id: 7070,
  createdDate: dayjs('2026-07-06T02:37'),
};

export const sampleWithFullData: IDepartments = {
  id: 58,
  name: 'pfft gracefully finished',
  description: 'miserably',
  createdBy: 'safely healthily',
  createdDate: dayjs('2026-07-06T00:07'),
  lastModifiedBy: 'sneak',
  lastModifiedDate: dayjs('2026-07-05T21:11'),
};

export const sampleWithNewData: NewDepartments = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
