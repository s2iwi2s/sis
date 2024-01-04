import { IAssessment, NewAssessment } from './assessment.model';

export const sampleWithRequiredData: IAssessment = {
  id: 4364,
};

export const sampleWithPartialData: IAssessment = {
  id: 5235,
  instruction: 'easily however awkwardly',
};

export const sampleWithFullData: IAssessment = {
  id: 26886,
  name: 'psst accelerator',
  instruction: 'merry recreate',
  markScheme: '../fake-data/blob/hipster.txt',
};

export const sampleWithNewData: NewAssessment = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
