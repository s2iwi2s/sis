import dayjs from 'dayjs/esm';

import { IAppConfig } from 'app/entities/app-config/app-config.model';
import { IInvoices } from 'app/entities/invoices/invoices.model';

export interface IPayments {
  id: number;
  amount?: number | null;
  transactionReference?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  method?: Pick<IAppConfig, 'id'> | null;
  invoices?: Pick<IInvoices, 'id'> | null;
}

export type NewPayments = Omit<IPayments, 'id'> & { id: null };
