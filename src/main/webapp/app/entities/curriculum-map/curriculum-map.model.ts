import dayjs from 'dayjs/esm';
import { ILearningCompetency } from 'app/entities/learning-competency/learning-competency.model';
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
  learningCompetencies?: Pick<ILearningCompetency, 'id'>[] | null;
  course?: Pick<ICourse, 'id'|'subject'|'gradelevel'|'schYr'> | null;
}

export type NewCurriculumMap = Omit<ICurriculumMap, 'id'> & { id: null };
