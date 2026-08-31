import { IClassSchedule, NewClassSchedule } from './class-schedule.model';

export const sampleWithRequiredData: IClassSchedule = {
  id: 3490,
};

export const sampleWithPartialData: IClassSchedule = {
  id: 11456,
  name: 'sweetly',
};

export const sampleWithFullData: IClassSchedule = {
  id: 14428,
  name: 'aside for misreport',
};

export const sampleWithNewData: NewClassSchedule = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
