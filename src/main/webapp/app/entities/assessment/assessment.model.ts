import { IResources } from 'app/entities/resources/resources.model';
import { ILearningCompetency } from 'app/entities/learning-competency/learning-competency.model';

export interface IAssessment {
  id: number;
  name?: string | null;
  instruction?: string | null;
  markScheme?: string | null;
  resources?: Pick<IResources, 'id'>[] | null;
  learningCompetency?: Pick<ILearningCompetency, 'id'> | null;
}

export type NewAssessment = Omit<IAssessment, 'id'> & { id: null };
