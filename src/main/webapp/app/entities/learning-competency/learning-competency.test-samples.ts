import dayjs from 'dayjs/esm';

import { ILearningCompetency, NewLearningCompetency } from './learning-competency.model';

export const sampleWithRequiredData: ILearningCompetency = {
  id: 15527,
};

export const sampleWithPartialData: ILearningCompetency = {
  id: 1115,
  createdDate: dayjs('2024-01-04T03:35'),
};

export const sampleWithFullData: ILearningCompetency = {
  id: 30946,
  seqNo: 13563,
  competencyCode: 'after underline',
  description: 'soupy',
  createdBy: 'whirlwind reassign than',
  createdDate: dayjs('2024-01-03T19:21'),
  lastModifiedBy: 'shimmer',
  lastModifiedDate: dayjs('2024-01-03T20:23'),
};

export const sampleWithNewData: NewLearningCompetency = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
