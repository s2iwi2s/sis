import dayjs from 'dayjs/esm';
import { IAppConfig } from 'app/entities/app-config/app-config.model';

export interface IOrg {
  id: number;
  name?: string | null;
  logo?: string | null;
  address?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  currSchYr?: Pick<IAppConfig, 'id'|'description'> | null;
}

export type NewOrg = Omit<IOrg, 'id'> & { id: null };
