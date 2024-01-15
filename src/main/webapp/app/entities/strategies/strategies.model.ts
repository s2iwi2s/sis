import { IResources } from 'app/entities/resources/resources.model';
import { ILearningCompetency } from 'app/entities/learning-competency/learning-competency.model';

export interface IStrategies {
  id: number;
  name?: string | null;
  description?: string | null;
  resources?: Pick<IResources, 'id'>[] | null;
  learningCompetency?: Pick<ILearningCompetency, 'id'|'competencyCode'|'description'> | null;
}

export type NewStrategies = Omit<IStrategies, 'id'> & { id: null };
