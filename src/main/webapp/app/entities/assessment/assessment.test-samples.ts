import dayjs from 'dayjs/esm';

import { IAssessment, NewAssessment } from './assessment.model';

export const sampleWithRequiredData: IAssessment = {
  id: 5235,
};

export const sampleWithPartialData: IAssessment = {
  id: 6113,
  instruction: 'needily',
  lastModifiedDate: dayjs('2024-01-04T07:43'),
};

export const sampleWithFullData: IAssessment = {
  id: 29652,
  name: 'civilization confiscate',
  instruction: 'inculcate',
  markScheme: '../fake-data/blob/hipster.txt',
  createdBy: 'brr onto',
  createdDate: dayjs('2024-01-03T11:06'),
  lastModifiedBy: 'nylon so',
  lastModifiedDate: dayjs('2024-01-03T14:06'),
};

export const sampleWithNewData: NewAssessment = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
