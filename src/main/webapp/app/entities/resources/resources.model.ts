import dayjs from 'dayjs/esm';
import { IStrategies } from 'app/entities/strategies/strategies.model';
import { IAssessment } from 'app/entities/assessment/assessment.model';

export interface IResources {
  id: number;
  fileName?: string | null;
  document?: string | null;
  documentContentType?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
}

export type NewResources = Omit<IResources, 'id'> & { id: null };
