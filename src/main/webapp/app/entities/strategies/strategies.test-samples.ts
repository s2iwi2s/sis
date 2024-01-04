import { IStrategies, NewStrategies } from './strategies.model';

export const sampleWithRequiredData: IStrategies = {
  id: 10235,
};

export const sampleWithPartialData: IStrategies = {
  id: 21422,
  name: 'idealistic blissful arrange',
};

export const sampleWithFullData: IStrategies = {
  id: 8630,
  name: 'crop',
  description: 'circa jittery',
};

export const sampleWithNewData: NewStrategies = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
