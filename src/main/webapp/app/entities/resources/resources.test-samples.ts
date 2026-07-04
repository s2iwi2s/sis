import dayjs from 'dayjs/esm';

import { IResources, NewResources } from './resources.model';

export const sampleWithRequiredData: IResources = {
  id: 12710,
};

export const sampleWithPartialData: IResources = {
  id: 24335,
  document: '../fake-data/blob/hipster.png',
  documentContentType: 'unknown',
};

export const sampleWithFullData: IResources = {
  id: 4164,
  fileName: 'zowie scope',
  document: '../fake-data/blob/hipster.png',
  documentContentType: 'unknown',
  createdBy: 'freely inborn slip',
  createdDate: dayjs('2026-07-04T02:31'),
  lastModifiedBy: 'unlike',
  lastModifiedDate: dayjs('2026-07-04T09:28'),
};

export const sampleWithNewData: NewResources = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
