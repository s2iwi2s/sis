import dayjs from 'dayjs/esm';

import { IInvoices, NewInvoices } from './invoices.model';

export const sampleWithRequiredData: IInvoices = {
  id: 11275,
};

export const sampleWithPartialData: IInvoices = {
  id: 25235,
  amountPaid: 18558.33,
  status: 'shout cons',
  lastModifiedBy: 'whose worriedly',
};

export const sampleWithFullData: IInvoices = {
  id: 19767,
  dueDate: dayjs('2026-08-31'),
  amountPaid: 23465.93,
  status: 'toward cru',
  createdBy: 'unfortunate pfft finally',
  createdDate: dayjs('2026-08-30'),
  lastModifiedBy: 'characterization yuck',
  lastModifiedDate: dayjs('2026-08-30'),
};

export const sampleWithNewData: NewInvoices = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
