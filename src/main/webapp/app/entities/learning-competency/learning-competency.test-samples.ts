import dayjs from 'dayjs/esm';

import { ILearningCompetency, NewLearningCompetency } from './learning-competency.model';

export const sampleWithRequiredData: ILearningCompetency = {
  id: 4120,
};

export const sampleWithPartialData: ILearningCompetency = {
  id: 15074,
  description: 'ah amidst',
  createdBy: 'furiously ah',
  createdDate: dayjs('2026-07-06T06:58'),
  lastModifiedDate: dayjs('2026-07-06T09:57'),
};

export const sampleWithFullData: ILearningCompetency = {
  id: 18941,
  seqNo: 22983,
  competencyCode: 'boastfully consequently lobster',
  description: 'uh-huh',
  createdBy: 'across vain consequently',
  createdDate: dayjs('2026-07-06T01:33'),
  lastModifiedBy: 'sate long',
  lastModifiedDate: dayjs('2026-07-06T01:37'),
};

export const sampleWithNewData: NewLearningCompetency = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
