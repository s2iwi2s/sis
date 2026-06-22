import dayjs from 'dayjs/esm';
import { IAppConfig } from 'app/entities/app-config/app-config.model';
import { ICurriculumMap } from 'app/entities/curriculum-map/curriculum-map.model';
import { IInstructor } from 'app/entities/instructor/instructor.model';
import { IStudent } from 'app/entities/student/student.model';

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
  gradelevel?: Pick<IAppConfig, 'id'|'description'> | null;
  schYr?: Pick<IAppConfig, 'id'|'description'> | null;
  curriculumMaps?: Pick<ICurriculumMap, 'id'>[] | null;
  instructors?: Pick<IInstructor, 'id'>[] | null;
  students?: Pick<IStudent, 'id'>[] | null;
}

export type NewCourse = Omit<ICourse, 'id'> & { id: null };
