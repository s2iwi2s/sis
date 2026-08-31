import { IGradeLevelPayables, NewGradeLevelPayables } from './grade-level-payables.model';

export const sampleWithRequiredData: IGradeLevelPayables = {
  id: 25864,
};

export const sampleWithPartialData: IGradeLevelPayables = {
  id: 18477,
  active: false,
};

export const sampleWithFullData: IGradeLevelPayables = {
  id: 20708,
  active: false,
};

export const sampleWithNewData: NewGradeLevelPayables = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
