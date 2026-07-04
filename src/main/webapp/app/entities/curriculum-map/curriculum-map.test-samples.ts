import dayjs from 'dayjs/esm';

import { ICurriculumMap, NewCurriculumMap } from './curriculum-map.model';

export const sampleWithRequiredData: ICurriculumMap = {
  id: 29680,
};

export const sampleWithPartialData: ICurriculumMap = {
  id: 18600,
  quarterNo: 1047,
  performanceStandards: 'barracks geez zowie',
  createdDate: dayjs('2026-07-04T11:34'),
};

export const sampleWithFullData: ICurriculumMap = {
  id: 2944,
  quarterNo: 16482,
  weekNo: 20615,
  topic: 'the glorious long',
  contentStandards: 'firsthand boohoo',
  performanceStandards: 'vastly ethyl',
  createdBy: 'vengeful riser noted',
  createdDate: dayjs('2026-07-04T10:07'),
  lastModifiedBy: 'over',
  lastModifiedDate: dayjs('2026-07-04T13:57'),
};

export const sampleWithNewData: NewCurriculumMap = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
