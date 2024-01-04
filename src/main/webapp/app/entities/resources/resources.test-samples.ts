import { IResources, NewResources } from './resources.model';

export const sampleWithRequiredData: IResources = {
  id: 32076,
};

export const sampleWithPartialData: IResources = {
  id: 10139,
  fileName: 'sharply',
  document: '../fake-data/blob/hipster.png',
  documentContentType: 'unknown',
};

export const sampleWithFullData: IResources = {
  id: 12418,
  fileName: 'married potentially',
  fileNameOnServer: 'fortunately tangible',
  document: '../fake-data/blob/hipster.png',
  documentContentType: 'unknown',
};

export const sampleWithNewData: NewResources = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
