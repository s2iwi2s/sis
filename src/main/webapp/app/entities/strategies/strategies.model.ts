import dayjs from 'dayjs/esm';
import { IResources } from 'app/entities/resources/resources.model';
import { ILearningCompetency } from 'app/entities/learning-competency/learning-competency.model';

export interface IStrategies {
  id: number;
  name?: string | null;
  description?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  resources?: Pick<IResources, 'id'>[] | null;
  learningCompetency?: Pick<ILearningCompetency, 'id'|'seqNo'|'competencyCode'> | null;
}

export type NewStrategies = Omit<IStrategies, 'id'> & { id: null };
