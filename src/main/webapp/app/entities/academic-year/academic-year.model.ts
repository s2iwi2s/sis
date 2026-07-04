import dayjs from 'dayjs/esm';

export interface IAcademicYear {
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
}

export type NewAcademicYear = Omit<IAcademicYear, 'id'> & { id: null };
