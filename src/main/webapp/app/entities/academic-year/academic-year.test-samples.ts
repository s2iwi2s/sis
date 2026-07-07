import dayjs from 'dayjs/esm';

import { IAcademicYear, NewAcademicYear } from './academic-year.model';

export const sampleWithRequiredData: IAcademicYear = {
  id: 18540,
};

export const sampleWithPartialData: IAcademicYear = {
  id: 13833,
  name: 'brush',
  endDate: dayjs('2026-07-05'),
  current: false,
  createdDate: dayjs('2026-07-05T16:07'),
  lastModifiedDate: dayjs('2026-07-05T15:33'),
};

export const sampleWithFullData: IAcademicYear = {
  id: 11023,
  name: 'consequently yum',
  code: 'observe volleyball what',
  startDate: dayjs('2026-07-06'),
  endDate: dayjs('2026-07-06'),
  current: true,
  createdBy: 'disclosure convince',
  createdDate: dayjs('2026-07-06T11:26'),
  lastModifiedBy: 'gee last phew',
  lastModifiedDate: dayjs('2026-07-05T19:31'),
};

export const sampleWithNewData: NewAcademicYear = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
