import dayjs from 'dayjs/esm';

import { IInstructor, NewInstructor } from './instructor.model';

export const sampleWithRequiredData: IInstructor = {
  id: 24112,
};

export const sampleWithPartialData: IInstructor = {
  id: 1863,
  middleName: 'smart midst',
  phoneNumber: 'fine omission',
  hireDate: dayjs('2024-01-03T15:42'),
  createdBy: 'fathom',
  lastModifiedDate: dayjs('2024-01-04T00:15'),
};

export const sampleWithFullData: IInstructor = {
  id: 30096,
  firstName: 'Jarred',
  middleName: 'relaunch moonwalk',
  lastName: 'Stanton',
  email: 'Art.Feest38@hotmail.com',
  phoneNumber: 'defense',
  hireDate: dayjs('2024-01-04T05:36'),
  salary: 5181,
  commissionPct: 9738,
  createdBy: 'although shrilly',
  createdDate: dayjs('2024-01-03T16:34'),
  lastModifiedBy: 'heckle absentmindedly warmhearted',
  lastModifiedDate: dayjs('2024-01-04T05:55'),
};

export const sampleWithNewData: NewInstructor = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
