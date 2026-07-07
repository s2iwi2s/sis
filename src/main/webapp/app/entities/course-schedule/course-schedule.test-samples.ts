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
  startTime: dayjs('2026-07-05T15:33'),
  endTime: dayjs('2026-07-05T20:38'),
  description: 'limply',
  createdBy: 'once painfully',
  createdDate: dayjs('2026-07-06T03:38'),
  lastModifiedBy: 'showboat',
  lastModifiedDate: dayjs('2026-07-06T00:59'),
};

export const sampleWithNewData: NewCourseSchedule = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
