import dayjs from 'dayjs/esm';

import { ICourse } from 'app/entities/course/course.model';

export interface ICurriculumMap {
  id: number;
  quarterNo?: number | null;
  weekNo?: number | null;
  topic?: string | null;
  contentStandards?: string | null;
  performanceStandards?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  course?: Pick<ICourse, 'id'> | null;
}

export type NewCurriculumMap = Omit<ICurriculumMap, 'id'> & { id: null };
