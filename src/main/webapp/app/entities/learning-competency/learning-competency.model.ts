import { IStrategies } from 'app/entities/strategies/strategies.model';
import { IAssessment } from 'app/entities/assessment/assessment.model';
import { ICurriculumMap } from 'app/entities/curriculum-map/curriculum-map.model';

export interface ILearningCompetency {
  id: number;
  seqNo?: number | null;
  competencyCode?: string | null;
  description?: string | null;
  strategies?: Pick<IStrategies, 'id'>[] | null;
  assessments?: Pick<IAssessment, 'id'>[] | null;
  curriculumMap?: Pick<ICurriculumMap, 'id'> | null;
}

export type NewLearningCompetency = Omit<ILearningCompetency, 'id'> & { id: null };
