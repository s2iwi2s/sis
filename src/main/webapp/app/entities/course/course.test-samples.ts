import dayjs from 'dayjs/esm';

import { ICourse, NewCourse } from './course.model';

export const sampleWithRequiredData: ICourse = {
  id: 24066,
};

export const sampleWithPartialData: ICourse = {
  id: 32263,
  subject: 'during anti detail',
  hoursPerQuarter: 23462,
  courseDescription: '../fake-data/blob/hipster.txt',
  createdDate: dayjs('2024-01-04T01:51'),
};

export const sampleWithFullData: ICourse = {
  id: 32006,
  subject: 'inside',
  hoursPerQuarter: 4284,
  courseDescription: '../fake-data/blob/hipster.txt',
  courseObjectives: '../fake-data/blob/hipster.txt',
  createdBy: 'harbour',
  createdDate: dayjs('2024-01-03T20:50'),
  lastModifiedBy: 'rarely powerfully even',
  lastModifiedDate: dayjs('2024-01-04T00:50'),
};

export const sampleWithNewData: NewCourse = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
