import dayjs from 'dayjs/esm';

import { IInstructor, NewInstructor } from './instructor.model';

export const sampleWithRequiredData: IInstructor = {
  id: 8088,
};

export const sampleWithPartialData: IInstructor = {
  id: 23554,
  firstName: 'Jermey',
  lastName: 'Torphy',
  createdDate: dayjs('2026-07-03T20:41'),
  lastModifiedBy: 'oh fabricate same',
  lastModifiedDate: dayjs('2026-07-03T22:34'),
};

export const sampleWithFullData: IInstructor = {
  id: 11749,
  firstName: 'Lana',
  middleName: 'other',
  lastName: 'Lind',
  email: 'Lambert.Bode42@gmail.com',
  phoneNumber: 'skateboard',
  hireDate: dayjs('2026-07-04T14:39'),
  salary: 6108,
  commissionPct: 554,
  createdBy: 'mean',
  createdDate: dayjs('2026-07-04T03:36'),
  lastModifiedBy: 'forsaken',
  lastModifiedDate: dayjs('2026-07-04T12:55'),
};

export const sampleWithNewData: NewInstructor = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
