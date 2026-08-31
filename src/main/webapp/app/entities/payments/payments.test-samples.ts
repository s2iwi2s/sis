import dayjs from 'dayjs/esm';

import { IPayments, NewPayments } from './payments.model';

export const sampleWithRequiredData: IPayments = {
  id: 22286,
};

export const sampleWithPartialData: IPayments = {
  id: 24213,
  amount: 2837.06,
  transactionReference: 'insolence geez',
  createdBy: 'squirm',
  createdDate: dayjs('2026-08-30'),
};

export const sampleWithFullData: IPayments = {
  id: 14741,
  amount: 31169.7,
  transactionReference: 'hmph',
  createdBy: 'hoot er',
  createdDate: dayjs('2026-08-30'),
  lastModifiedBy: 'siege',
  lastModifiedDate: dayjs('2026-08-30'),
};

export const sampleWithNewData: NewPayments = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
