import dayjs from 'dayjs/esm';

import { IGradeLevelPayables } from 'app/entities/grade-level-payables/grade-level-payables.model';
import { IInvoices } from 'app/entities/invoices/invoices.model';

export interface IAccountPayables {
  id: number;
  name?: string | null;
  description?: string | null;
  amount?: number | null;
  priority?: number | null;
  active?: boolean | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  invoices?: Pick<IInvoices, 'id'> | null;
  gradeLevelPayables?: Pick<IGradeLevelPayables, 'id'> | null;
}

export type NewAccountPayables = Omit<IAccountPayables, 'id'> & { id: null };
