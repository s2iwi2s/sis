import dayjs from 'dayjs/esm';

import { IAppConfig } from 'app/entities/app-config/app-config.model';
import { ICourseSchedule } from 'app/entities/course-schedule/course-schedule.model';
import { IUser } from 'app/entities/user/user.model';

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
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  gender?: Pick<IAppConfig, 'id'> | null;
  user?: Pick<IUser, 'id'> | null;
  courseSchedules?: Pick<ICourseSchedule, 'id'>[] | null;
}

export type NewInstructor = Omit<IInstructor, 'id'> & { id: null };
