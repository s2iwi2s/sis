import dayjs from 'dayjs/esm';

import { IInstructor, NewInstructor } from './instructor.model';

export const sampleWithRequiredData: IInstructor = {
  id: 6236,
};

export const sampleWithPartialData: IInstructor = {
  id: 1389,
  middleName: 'bleakly supposing',
  hireDate: dayjs('2024-01-03T14:52'),
};

export const sampleWithFullData: IInstructor = {
  id: 12345,
  firstName: 'Dovie',
  middleName: 'equalise unabashedly',
  lastName: 'Stiedemann',
  email: 'Bailey40@hotmail.com',
  phoneNumber: 'up',
  hireDate: dayjs('2024-01-03T21:52'),
  salary: 20819,
  commissionPct: 24888,
};

export const sampleWithNewData: NewInstructor = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
