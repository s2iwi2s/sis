import dayjs from 'dayjs/esm';

import { IAcademicTerms, NewAcademicTerms } from './academic-terms.model';

export const sampleWithRequiredData: IAcademicTerms = {
  id: 30574,
};

export const sampleWithPartialData: IAcademicTerms = {
  id: 13451,
  name: 'rule synthesise neighboring',
  startDate: dayjs('2026-07-06'),
  endDate: dayjs('2026-07-05'),
  current: false,
  createdBy: 'bah tenderly tangible',
  createdDate: dayjs('2026-07-05T23:57'),
  lastModifiedBy: 'downright',
};

export const sampleWithFullData: IAcademicTerms = {
  id: 9404,
  name: 'thrifty limply instead',
  code: 'beyond easily rowdy',
  startDate: dayjs('2026-07-06'),
  endDate: dayjs('2026-07-05'),
  current: false,
  createdBy: 'as',
  createdDate: dayjs('2026-07-06T08:50'),
  lastModifiedBy: 'any tributary',
  lastModifiedDate: dayjs('2026-07-06T12:15'),
};

export const sampleWithNewData: NewAcademicTerms = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
