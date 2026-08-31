import dayjs from 'dayjs/esm';

import { IAcademicTerms } from 'app/entities/academic-terms/academic-terms.model';
import { IAcademicYear } from 'app/entities/academic-year/academic-year.model';
import { IStudent } from 'app/entities/student/student.model';

export interface IEnrollment {
  id: number;
  active?: boolean | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  year?: Pick<IAcademicYear, 'id'> | null;
  terms?: Pick<IAcademicTerms, 'id'> | null;
  student?: Pick<IStudent, 'id'> | null;
}

export type NewEnrollment = Omit<IEnrollment, 'id'> & { id: null };
