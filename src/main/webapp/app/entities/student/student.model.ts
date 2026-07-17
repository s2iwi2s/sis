import dayjs from 'dayjs/esm';

import { IAppConfig } from 'app/entities/app-config/app-config.model';
import { ICourseSchedule } from 'app/entities/course-schedule/course-schedule.model';
import { IUser } from 'app/entities/user/user.model';

export interface IStudent {
  id: number;
  lrn?: string | null;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  extName?: string | null;
  enrollmentDate?: dayjs.Dayjs | null;
  birthDate?: dayjs.Dayjs | null;
  birthPlace?: string | null;
  contactNo?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  zipCode?: string | null;
  country?: string | null;
  nationality?: string | null;
  citizenship?: string | null;
  motherTongue?: string | null;
  religion?: string | null;
  fathersLastName?: string | null;
  fathersMiddleName?: string | null;
  fathersFirstName?: string | null;
  fathersExtName?: string | null;
  fathersOccupation?: string | null;
  fathersContacts?: string | null;
  mothersLastName?: string | null;
  mothersMiddleName?: string | null;
  mothersFirstName?: string | null;
  mothersOccupation?: string | null;
  mothersContacts?: string | null;
  guardianFullName?: string | null;
  guardianContacts?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  gender?: Pick<IAppConfig, 'id' | 'value'> | null;
  gradelevel?: Pick<IAppConfig, 'id' | 'value'> | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
  courseSchedules?: Pick<ICourseSchedule, 'id'>[] | null;
}

export interface IStudentFilter {
  lrn: string | null;
  gradelevel?: Pick<IAppConfig, 'id' | 'value'> | null;
  firstName: string | null;
  lastName: string | null;
  birthDate: string | null;
}

export type NewStudent = Omit<IStudent, 'id'> & { id: null };
