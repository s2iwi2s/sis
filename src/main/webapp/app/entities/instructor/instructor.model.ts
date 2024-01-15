import dayjs from 'dayjs/esm';
import { IAppConfig } from 'app/entities/app-config/app-config.model';
import { ICourse } from 'app/entities/course/course.model';

export interface IInstructor {
  id: number;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  hireDate?: dayjs.Dayjs | null;
  salary?: number | null;
  commissionPct?: number | null;
  gender?: Pick<IAppConfig, 'id'|'description'> | null;
  courses?: Pick<ICourse, 'id'>[] | null;
}

export type NewInstructor = Omit<IInstructor, 'id'> & { id: null };
