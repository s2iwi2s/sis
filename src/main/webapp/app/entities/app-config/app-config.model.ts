import dayjs from 'dayjs/esm';

export interface IAppConfig {
  id: number;
  code?: string | null;
  value?: string | null;
  description?: string | null;
  json?: string | null;
  priority?: number | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
}

export type NewAppConfig = Omit<IAppConfig, 'id'> & { id: null };
