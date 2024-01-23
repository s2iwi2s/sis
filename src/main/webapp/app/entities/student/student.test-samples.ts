import dayjs from 'dayjs/esm';

import { IStudent, NewStudent } from './student.model';

export const sampleWithRequiredData: IStudent = {
  id: 25235,
};

export const sampleWithPartialData: IStudent = {
  id: 2181,
  birthDate: dayjs('2024-01-04T06:51'),
  birthPlace: 'veldt yet',
  address1: 'colorfully clatter queasily',
  address2: 'gah curiously overplay',
  city: 'Braunboro',
  country: 'Nicaragua',
  nationality: 'miserably arm',
  motherTongue: 'regularly round finally',
  religion: 'following',
  fathersLastName: 'norm if lest',
  fathersMiddleName: 'delight who',
  fathersExtName: 'and over',
  fathersOccupation: 'because oof',
  fathersContacts: 'gosh',
  mothersLastName: 'exalted notwithstanding',
  guardianFullName: 'suspiciously yippee bah',
  guardianContacts: 'tensely',
  createdBy: 'aside',
  createdDate: dayjs('2024-01-04T01:23'),
  lastModifiedBy: 'evil',
  lastModifiedDate: dayjs('2024-01-04T03:55'),
};

export const sampleWithFullData: IStudent = {
  id: 2934,
  lrn: 'guard naturally um',
  firstName: 'Beau',
  middleName: 'limit',
  lastName: 'Daugherty',
  extName: 'gah vice',
  birthDate: dayjs('2024-01-04T03:17'),
  birthPlace: 'save whereas',
  contactNo: 'ew',
  address1: 'recover illustration contact',
  address2: 'chord',
  city: 'Oberbrunnerchester',
  zipCode: '86697-3210',
  country: 'Falkland Islands (Malvinas)',
  nationality: 'brown',
  motherTongue: 'combine',
  religion: 'innocently retouch',
  fathersLastName: 'like but even',
  fathersMiddleName: 'dock vain',
  fathersFirstName: 'churn',
  fathersExtName: 'indict kindheartedly um',
  fathersOccupation: 'recklessly up',
  fathersContacts: 'awe fooey',
  mothersLastName: 'hosiery',
  mothersMiddleName: 'modulo',
  mothersFirstName: 'bloomer mmm well-off',
  mothersOccupation: 'elegantly mismatch guard',
  mothersContacts: 'anenst at consequently',
  guardianFullName: 'expansionism',
  guardianContacts: 'cavil fondly ew',
  createdBy: 'whenever',
  createdDate: dayjs('2024-01-03T11:55'),
  lastModifiedBy: 'encode hackwork',
  lastModifiedDate: dayjs('2024-01-03T11:54'),
};

export const sampleWithNewData: NewStudent = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
