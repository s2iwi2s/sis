import dayjs from 'dayjs/esm';

import { ILearningCompetency, NewLearningCompetency } from './learning-competency.model';

export const sampleWithRequiredData: ILearningCompetency = {
  id: 4120,
};

export const sampleWithPartialData: ILearningCompetency = {
  id: 15074,
  description: 'ah amidst',
  createdBy: 'furiously ah',
  createdDate: dayjs('2026-07-04T07:51'),
  lastModifiedDate: dayjs('2026-07-04T10:51'),
};

export const sampleWithFullData: ILearningCompetency = {
  id: 18941,
  seqNo: 22983,
  competencyCode: 'boastfully consequently lobster',
  description: 'uh-huh',
  createdBy: 'across vain consequently',
  createdDate: dayjs('2026-07-04T02:26'),
  lastModifiedBy: 'sate long',
  lastModifiedDate: dayjs('2026-07-04T02:30'),
};

export const sampleWithNewData: NewLearningCompetency = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
