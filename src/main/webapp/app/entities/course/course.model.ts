import { IAppConfig } from 'app/entities/app-config/app-config.model';
import { ICurriculumMap } from 'app/entities/curriculum-map/curriculum-map.model';
import { IInstructor } from 'app/entities/instructor/instructor.model';
import { IStudent } from 'app/entities/student/student.model';

export interface ICourse {
  id: number;
  gradelevel?: string | null;
  subject?: string | null;
  hoursPerQuarter?: number | null;
  courseDescription?: string | null;
  courseObjectives?: string | null;
  schYr?: Pick<IAppConfig, 'id'> | null;
  curriculumMaps?: Pick<ICurriculumMap, 'id'>[] | null;
  instructors?: Pick<IInstructor, 'id'>[] | null;
  students?: Pick<IStudent, 'id'>[] | null;
}

export type NewCourse = Omit<ICourse, 'id'> & { id: null };
