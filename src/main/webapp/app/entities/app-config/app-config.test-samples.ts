import dayjs from 'dayjs/esm';

import { IAppConfig, NewAppConfig } from './app-config.model';

export const sampleWithRequiredData: IAppConfig = {
  id: 4221,
};

export const sampleWithPartialData: IAppConfig = {
  id: 29222,
  value: 'hence',
  json: '../fake-data/blob/hipster.txt',
  priority: 9075,
  createdBy: 'phooey',
  lastModifiedBy: 'feud apropos',
  lastModifiedDate: dayjs('2024-01-03T15:32'),
};

export const sampleWithFullData: IAppConfig = {
  id: 19118,
  code: 'damage',
  value: 'aw',
  description: 'what',
  json: '../fake-data/blob/hipster.txt',
  priority: 20008,
  createdBy: 'teem mostly phooey',
  createdDate: dayjs('2024-01-03T21:37'),
  lastModifiedBy: 'husky',
  lastModifiedDate: dayjs('2024-01-03T16:20'),
};

export const sampleWithNewData: NewAppConfig = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
