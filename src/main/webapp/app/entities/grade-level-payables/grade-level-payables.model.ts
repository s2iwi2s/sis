import { IAppConfig } from 'app/entities/app-config/app-config.model';

export interface IGradeLevelPayables {
  id: number;
  active?: boolean | null;
  gradelevel?: Pick<IAppConfig, 'id'> | null;
}

export type NewGradeLevelPayables = Omit<IGradeLevelPayables, 'id'> & { id: null };
