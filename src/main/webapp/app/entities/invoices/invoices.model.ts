import dayjs from 'dayjs/esm';

import { IStudent } from 'app/entities/student/student.model';

export interface IInvoices {
  id: number;
  dueDate?: dayjs.Dayjs | null;
  amountPaid?: number | null;
  status?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  student?: Pick<IStudent, 'id'> | null;
}

export type NewInvoices = Omit<IInvoices, 'id'> & { id: null };
