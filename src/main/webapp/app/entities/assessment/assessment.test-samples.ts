import dayjs from 'dayjs/esm';

import { IAssessment, NewAssessment } from './assessment.model';

export const sampleWithRequiredData: IAssessment = {
  id: 4003,
};

export const sampleWithPartialData: IAssessment = {
  id: 9985,
  name: 'gratefully likely duffel',
  createdBy: 'although aside resource',
  createdDate: dayjs('2026-07-05T20:57'),
};

export const sampleWithFullData: IAssessment = {
  id: 1893,
  name: 'pish',
  instruction: 'between blah contrail',
  markScheme: '../fake-data/blob/hipster.txt',
  createdBy: 'besides than',
  createdDate: dayjs('2026-07-06T07:34'),
  lastModifiedBy: 'meanwhile oof mainstream',
  lastModifiedDate: dayjs('2026-07-05T23:18'),
};

export const sampleWithNewData: NewAssessment = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
