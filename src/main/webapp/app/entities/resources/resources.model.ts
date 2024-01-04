import { IStrategies } from 'app/entities/strategies/strategies.model';
import { IAssessment } from 'app/entities/assessment/assessment.model';

export interface IResources {
  id: number;
  fileName?: string | null;
  fileNameOnServer?: string | null;
  document?: string | null;
  documentContentType?: string | null;
  strategies?: Pick<IStrategies, 'id'> | null;
  assessment?: Pick<IAssessment, 'id'> | null;
}

export type NewResources = Omit<IResources, 'id'> & { id: null };
