import dayjs from 'dayjs/esm';

import { IAppConfig, NewAppConfig } from './app-config.model';

export const sampleWithRequiredData: IAppConfig = {
  id: 9401,
};

export const sampleWithPartialData: IAppConfig = {
  id: 13419,
  code: 'pupil toady',
  value: 'aha',
  description: 'nor',
  createdBy: 'about despite',
};

export const sampleWithFullData: IAppConfig = {
  id: 11442,
  code: 'inspect because',
  value: 'whenever',
  description: 'cake',
  json: '../fake-data/blob/hipster.txt',
  priority: 10825,
  createdBy: 'our for however',
  createdDate: dayjs('2026-07-06T07:35'),
  lastModifiedBy: 'athletic charter about',
  lastModifiedDate: dayjs('2026-07-06T04:44'),
};

export const sampleWithNewData: NewAppConfig = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
