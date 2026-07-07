import dayjs from 'dayjs/esm';

import { ICourse, NewCourse } from './course.model';

export const sampleWithRequiredData: ICourse = {
  id: 8824,
};

export const sampleWithPartialData: ICourse = {
  id: 29293,
  subject: 'ugh',
  hoursPerQuarter: 17207,
  createdDate: dayjs('2026-07-05T21:11'),
  lastModifiedBy: 'blaspheme',
};

export const sampleWithFullData: ICourse = {
  id: 30968,
  subject: 'weakly',
  hoursPerQuarter: 12043,
  courseDescription: '../fake-data/blob/hipster.txt',
  courseObjectives: '../fake-data/blob/hipster.txt',
  createdBy: 'yippee',
  createdDate: dayjs('2026-07-05T18:19'),
  lastModifiedBy: 'drat develop after',
  lastModifiedDate: dayjs('2026-07-06T05:11'),
};

export const sampleWithNewData: NewCourse = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
