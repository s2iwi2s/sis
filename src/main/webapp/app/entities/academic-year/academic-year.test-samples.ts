import dayjs from 'dayjs/esm';

import { IAcademicYear, NewAcademicYear } from './academic-year.model';

export const sampleWithRequiredData: IAcademicYear = {
  id: 18540,
};

export const sampleWithPartialData: IAcademicYear = {
  id: 13833,
  name: 'brush',
  endDate: dayjs('2026-07-03'),
  current: false,
  createdDate: dayjs('2026-07-03T17:00'),
  lastModifiedDate: dayjs('2026-07-03T16:26'),
};

export const sampleWithFullData: IAcademicYear = {
  id: 11023,
  name: 'consequently yum',
  code: 'observe volleyball what',
  startDate: dayjs('2026-07-04'),
  endDate: dayjs('2026-07-04'),
  current: true,
  createdBy: 'disclosure convince',
  createdDate: dayjs('2026-07-04T12:19'),
  lastModifiedBy: 'gee last phew',
  lastModifiedDate: dayjs('2026-07-03T20:24'),
};

export const sampleWithNewData: NewAcademicYear = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
