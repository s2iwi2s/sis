import dayjs from 'dayjs/esm';

import { IAccountPayables, NewAccountPayables } from './account-payables.model';

export const sampleWithRequiredData: IAccountPayables = {
  id: 20252,
};

export const sampleWithPartialData: IAccountPayables = {
  id: 13792,
  name: 'to pfft',
  description: 'via book ghost',
  lastModifiedDate: dayjs('2026-08-30'),
};

export const sampleWithFullData: IAccountPayables = {
  id: 28073,
  name: 'rag yum sweetly',
  description: 'icebreaker of',
  amount: 13490.14,
  priority: 22642,
  active: true,
  createdBy: 'coolly plus',
  createdDate: dayjs('2026-08-30'),
  lastModifiedBy: 'failing ambitious',
  lastModifiedDate: dayjs('2026-08-30'),
};

export const sampleWithNewData: NewAccountPayables = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
