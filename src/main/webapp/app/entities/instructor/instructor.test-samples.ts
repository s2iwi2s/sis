import dayjs from 'dayjs/esm';

import { IInstructor, NewInstructor } from './instructor.model';

export const sampleWithRequiredData: IInstructor = {
  id: 8088,
};

export const sampleWithPartialData: IInstructor = {
  id: 23554,
  firstName: 'Jermey',
  lastName: 'Torphy',
  createdDate: dayjs('2026-07-02T02:36'),
  lastModifiedBy: 'oh fabricate same',
  lastModifiedDate: dayjs('2026-07-02T04:29'),
};

export const sampleWithFullData: IInstructor = {
  id: 11749,
  firstName: 'Lana',
  middleName: 'other',
  lastName: 'Lind',
  email: 'Lambert.Bode42@gmail.com',
  phoneNumber: 'skateboard',
  hireDate: dayjs('2026-07-02T20:35'),
  salary: 6108,
  commissionPct: 554,
  createdBy: 'mean',
  createdDate: dayjs('2026-07-02T09:32'),
  lastModifiedBy: 'forsaken',
  lastModifiedDate: dayjs('2026-07-02T18:50'),
};

export const sampleWithNewData: NewInstructor = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
