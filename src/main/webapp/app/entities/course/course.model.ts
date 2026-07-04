import dayjs from 'dayjs/esm';

import { IAcademicTerms } from 'app/entities/academic-terms/academic-terms.model';
import { IAcademicYear } from 'app/entities/academic-year/academic-year.model';
import { IAppConfig } from 'app/entities/app-config/app-config.model';
import { IDepartments } from 'app/entities/departments/departments.model';

export interface ICourse {
  id: number;
  subject?: string | null;
  hoursPerQuarter?: number | null;
  courseDescription?: string | null;
  courseObjectives?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  gradelevel?: Pick<IAppConfig, 'id' | 'description'> | null;
  department?: Pick<IDepartments, 'id' | 'name'> | null;
  year?: Pick<IAcademicYear, 'id' | 'name'> | null;
  terms?: Pick<IAcademicTerms, 'id' | 'name'> | null;
}

export type NewCourse = Omit<ICourse, 'id'> & { id: null };
