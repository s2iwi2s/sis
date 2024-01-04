import { ILearningCompetency, NewLearningCompetency } from './learning-competency.model';

export const sampleWithRequiredData: ILearningCompetency = {
  id: 21702,
};

export const sampleWithPartialData: ILearningCompetency = {
  id: 15527,
  seqNo: 28259,
  competencyCode: 'fast briskly',
  description: 'fuel failing',
};

export const sampleWithFullData: ILearningCompetency = {
  id: 18866,
  seqNo: 23126,
  competencyCode: 'unto plus circa',
  description: 'what neat ouch',
};

export const sampleWithNewData: NewLearningCompetency = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
