import { IAppConfig } from 'app/entities/app-config/app-config.model';

export interface IOrg {
  id: number;
  name?: string | null;
  logo?: string | null;
  address?: string | null;
  currSchYr?: Pick<IAppConfig, 'id'|'description'> | null;
}

export type NewOrg = Omit<IOrg, 'id'> & { id: null };
