import { ICurriculumMap, NewCurriculumMap } from './curriculum-map.model';

export const sampleWithRequiredData: ICurriculumMap = {
  id: 5244,
};

export const sampleWithPartialData: ICurriculumMap = {
  id: 20825,
  quarterNo: 2997,
  topic: 'aha',
};

export const sampleWithFullData: ICurriculumMap = {
  id: 10434,
  quarterNo: 7131,
  weekNo: 15036,
  topic: 'satisfaction',
  contentStandards: 'valid ah interpreter',
  performanceStandards: 'pinpoint whose sneaky',
};

export const sampleWithNewData: NewCurriculumMap = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
