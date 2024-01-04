import { IAppConfig, NewAppConfig } from './app-config.model';

export const sampleWithRequiredData: IAppConfig = {
  id: 26043,
};

export const sampleWithPartialData: IAppConfig = {
  id: 13032,
  code: 'unlike gain woot',
  json: '../fake-data/blob/hipster.txt',
};

export const sampleWithFullData: IAppConfig = {
  id: 25373,
  code: 'deplane',
  value: 'worth fine shame',
  description: 'encroach',
  json: '../fake-data/blob/hipster.txt',
  priority: 25391,
};

export const sampleWithNewData: NewAppConfig = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
