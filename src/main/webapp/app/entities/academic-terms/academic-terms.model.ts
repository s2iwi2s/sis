import dayjs from 'dayjs/esm';

import { IAcademicYear } from 'app/entities/academic-year/academic-year.model';

export interface IAcademicTerms {
  id: number;
  name?: string | null;
  code?: string | null;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  current?: boolean | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  year?: Pick<IAcademicYear, 'id'> | null;
}

export type NewAcademicTerms = Omit<IAcademicTerms, 'id'> & { id: null };
