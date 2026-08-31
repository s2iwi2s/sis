import dayjs from 'dayjs/esm';

import { IEnrollment, NewEnrollment } from './enrollment.model';

export const sampleWithRequiredData: IEnrollment = {
  id: 30012,
};

export const sampleWithPartialData: IEnrollment = {
  id: 9616,
  active: true,
  lastModifiedDate: dayjs('2026-08-30T13:42'),
};

export const sampleWithFullData: IEnrollment = {
  id: 22773,
  active: false,
  createdBy: 'fatally regularly',
  createdDate: dayjs('2026-08-30T16:00'),
  lastModifiedBy: 'enraged huzzah',
  lastModifiedDate: dayjs('2026-08-30T15:12'),
};

export const sampleWithNewData: NewEnrollment = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
