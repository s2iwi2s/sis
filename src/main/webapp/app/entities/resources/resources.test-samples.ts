import dayjs from 'dayjs/esm';

import { IResources, NewResources } from './resources.model';

export const sampleWithRequiredData: IResources = {
  id: 1891,
};

export const sampleWithPartialData: IResources = {
  id: 19594,
  fileName: 'dreary athwart',
  document: '../fake-data/blob/hipster.png',
  documentContentType: 'unknown',
  createdBy: 'psst yet soccer',
  createdDate: dayjs('2024-01-04T04:06'),
};

export const sampleWithFullData: IResources = {
  id: 14009,
  fileName: 'irritably tergiversate',
  document: '../fake-data/blob/hipster.png',
  documentContentType: 'unknown',
  createdBy: 'lone apprise',
  createdDate: dayjs('2024-01-04T00:39'),
  lastModifiedBy: 'painfully if',
  lastModifiedDate: dayjs('2024-01-03T18:32'),
};

export const sampleWithNewData: NewResources = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
