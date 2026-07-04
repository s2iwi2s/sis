import dayjs from 'dayjs/esm';

import { IAssessment, NewAssessment } from './assessment.model';

export const sampleWithRequiredData: IAssessment = {
  id: 4003,
};

export const sampleWithPartialData: IAssessment = {
  id: 9985,
  name: 'gratefully likely duffel',
  createdBy: 'although aside resource',
  createdDate: dayjs('2026-07-03T21:50'),
};

export const sampleWithFullData: IAssessment = {
  id: 1893,
  name: 'pish',
  instruction: 'between blah contrail',
  markScheme: '../fake-data/blob/hipster.txt',
  createdBy: 'besides than',
  createdDate: dayjs('2026-07-04T08:27'),
  lastModifiedBy: 'meanwhile oof mainstream',
  lastModifiedDate: dayjs('2026-07-04T00:11'),
};

export const sampleWithNewData: NewAssessment = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
