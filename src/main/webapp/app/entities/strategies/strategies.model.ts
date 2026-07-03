import dayjs from 'dayjs/esm';

import { ILearningCompetency } from 'app/entities/learning-competency/learning-competency.model';
import { IResources } from 'app/entities/resources/resources.model';

export interface IStrategies {
  id: number;
  name?: string | null;
  description?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  resourceses?: Pick<IResources, 'id'>[] | null;
  learningCompetency?: Pick<ILearningCompetency, 'id'> | null;
}

export type NewStrategies = Omit<IStrategies, 'id'> & { id: null };
