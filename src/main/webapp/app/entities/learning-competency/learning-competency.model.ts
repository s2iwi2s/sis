import dayjs from 'dayjs/esm';

import { ICurriculumMap } from 'app/entities/curriculum-map/curriculum-map.model';

export interface ILearningCompetency {
  id: number;
  seqNo?: number | null;
  competencyCode?: string | null;
  description?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  curriculumMap?: Pick<ICurriculumMap, 'id'> | null;
}

export type NewLearningCompetency = Omit<ILearningCompetency, 'id'> & { id: null };
