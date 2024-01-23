import dayjs from 'dayjs/esm';

import { ICurriculumMap, NewCurriculumMap } from './curriculum-map.model';

export const sampleWithRequiredData: ICurriculumMap = {
  id: 25507,
};

export const sampleWithPartialData: ICurriculumMap = {
  id: 18399,
  topic: 'mmm phony',
  contentStandards: 'supposing since regal',
  performanceStandards: 'thoughtfully',
  createdDate: dayjs('2024-01-04T07:52'),
  lastModifiedBy: 'quizzically',
};

export const sampleWithFullData: ICurriculumMap = {
  id: 25187,
  quarterNo: 25266,
  weekNo: 75,
  topic: 'while',
  contentStandards: 'truthfully',
  performanceStandards: 'bust absent creaking',
  createdBy: 'hmph temptation honorable',
  createdDate: dayjs('2024-01-03T21:46'),
  lastModifiedBy: 'provided carefully near',
  lastModifiedDate: dayjs('2024-01-03T22:57'),
};

export const sampleWithNewData: NewCurriculumMap = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
