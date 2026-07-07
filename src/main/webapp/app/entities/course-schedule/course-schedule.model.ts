import dayjs from 'dayjs/esm';

import { IAcademicTerms } from 'app/entities/academic-terms/academic-terms.model';
import { IAcademicYear } from 'app/entities/academic-year/academic-year.model';
import { IInstructor } from 'app/entities/instructor/instructor.model';
import { IStudent } from 'app/entities/student/student.model';

export interface ICourseSchedule {
  id: number;
  room?: string | null;
  weekDay?: number | null;
  startTime?: dayjs.Dayjs | null;
  endTime?: dayjs.Dayjs | null;
  description?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  terms?: Pick<IAcademicTerms, 'id'> | null;
  year?: Pick<IAcademicYear, 'id'> | null;
  instructors?: Pick<IInstructor, 'id'>[] | null;
  students?: Pick<IStudent, 'id'>[] | null;
}

export type NewCourseSchedule = Omit<ICourseSchedule, 'id'> & { id: null };
