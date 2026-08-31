import { IAcademicTerms } from 'app/entities/academic-terms/academic-terms.model';
import { IAcademicYear } from 'app/entities/academic-year/academic-year.model';
import { IAppConfig } from 'app/entities/app-config/app-config.model';

export interface IClassSchedule {
  id: number;
  name?: string | null;
  gradelevel?: Pick<IAppConfig, 'id'> | null;
  terms?: Pick<IAcademicTerms, 'id'> | null;
  year?: Pick<IAcademicYear, 'id'> | null;
}

export type NewClassSchedule = Omit<IClassSchedule, 'id'> & { id: null };
