import dayjs from 'dayjs/esm';

import { ICourseSchedule, NewCourseSchedule } from './course-schedule.model';

export const sampleWithRequiredData: ICourseSchedule = {
  id: 10299,
};

export const sampleWithPartialData: ICourseSchedule = {
  id: 4968,
  room: 'wallaby blissfully weakly',
  weekDay: 14061,
  createdBy: 'drat',
  lastModifiedBy: 'countess replacement',
};

export const sampleWithFullData: ICourseSchedule = {
  id: 16687,
  room: 'lava last yum',
  weekDay: 22106,
  startTime: dayjs('2026-07-03T16:27'),
  endTime: dayjs('2026-07-03T21:32'),
  description: 'limply',
  createdBy: 'once painfully',
  createdDate: dayjs('2026-07-04T04:32'),
  lastModifiedBy: 'showboat',
  lastModifiedDate: dayjs('2026-07-04T01:52'),
};

export const sampleWithNewData: NewCourseSchedule = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
