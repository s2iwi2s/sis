import dayjs from 'dayjs/esm';
import { IAppConfig } from 'app/entities/app-config/app-config.model';
import { ICourse } from 'app/entities/course/course.model';

export interface IStudent {
  id: number;
  lrn?: string | null;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  extName?: string | null;
  birthDate?: dayjs.Dayjs | null;
  birthPlace?: string | null;
  contactNo?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  zipCode?: string | null;
  country?: string | null;
  nationality?: string | null;
  motherTongue?: string | null;
  religion?: string | null;
  fathersLastName?: string | null;
  fathersMiddleName?: string | null;
  fathersFirstName?: string | null;
  fathersExtName?: string | null;
  fathersOccupation?: string | null;
  fathersContacts?: string | null;
  mothersLastName?: string | null;
  mothersMiddleName?: string | null;
  mothersFirstName?: string | null;
  mothersOccupation?: string | null;
  mothersContacts?: string | null;
  guardianFullName?: string | null;
  guardianContacts?: string | null;
  gender?: Pick<IAppConfig, 'id'|'description'> | null;
  courses?: Pick<ICourse, 'id'|'courseDescription'>[] | null;
}

export type NewStudent = Omit<IStudent, 'id'> & { id: null };
