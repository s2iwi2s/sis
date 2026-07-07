import dayjs from 'dayjs/esm';

import { IInstructor, NewInstructor } from './instructor.model';

export const sampleWithRequiredData: IInstructor = {
  id: 8088,
};

export const sampleWithPartialData: IInstructor = {
  id: 23554,
  firstName: 'Jermey',
  lastName: 'Torphy',
  createdDate: dayjs('2026-07-05T19:48'),
  lastModifiedBy: 'oh fabricate same',
  lastModifiedDate: dayjs('2026-07-05T21:41'),
};

export const sampleWithFullData: IInstructor = {
  id: 11749,
  firstName: 'Lana',
  middleName: 'other',
  lastName: 'Lind',
  email: 'Lambert.Bode42@gmail.com',
  phoneNumber: 'skateboard',
  hireDate: dayjs('2026-07-06T13:46'),
  salary: 6108,
  commissionPct: 554,
  createdBy: 'mean',
  createdDate: dayjs('2026-07-06T02:43'),
  lastModifiedBy: 'forsaken',
  lastModifiedDate: dayjs('2026-07-06T12:02'),
};

export const sampleWithNewData: NewInstructor = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
