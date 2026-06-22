import dayjs from 'dayjs/esm';
import { IOrg } from 'app/entities/org/org.model';
import { IInstructor } from 'app/entities/instructor/instructor.model';
import { IStudent } from 'app/entities/student/student.model';
import { ICourse } from 'app/entities/course/course.model';

export interface IAppConfig {
  id: number;
  code?: string | null;
  value?: string | null;
  description?: string | null;
  json?: string | null;
  priority?: number | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  org?: Pick<IOrg, 'id'> | null;
  instructor?: Pick<IInstructor, 'id'> | null;
  student?: Pick<IStudent, 'id'> | null;
  course?: Pick<ICourse, 'id'> | null;
}

export type NewAppConfig = Omit<IAppConfig, 'id'> & { id: null };
