import { ICourse, NewCourse } from './course.model';

export const sampleWithRequiredData: ICourse = {
  id: 16907,
};

export const sampleWithPartialData: ICourse = {
  id: 7607,
  subject: 'psst euphoric quick-witted',
  hoursPerQuarter: 17837,
  courseObjectives: '../fake-data/blob/hipster.txt',
};

export const sampleWithFullData: ICourse = {
  id: 786,
  gradelevel: 'aggression cougar',
  subject: 'huzzah harbour viewer',
  hoursPerQuarter: 10293,
  courseDescription: '../fake-data/blob/hipster.txt',
  courseObjectives: '../fake-data/blob/hipster.txt',
};

export const sampleWithNewData: NewCourse = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
