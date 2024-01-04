import dayjs from 'dayjs/esm';

import { IStudent, NewStudent } from './student.model';

export const sampleWithRequiredData: IStudent = {
  id: 10173,
};

export const sampleWithPartialData: IStudent = {
  id: 29227,
  lrn: 'bargain inasmuch',
  firstName: 'Gennaro',
  middleName: 'yet functional versus',
  address2: 'queasily',
  city: 'Ondrickaton',
  country: 'Somalia',
  nationality: 'buzzard music-box',
  motherTongue: 'preclude miserably',
  fathersLastName: 'taxpayer regularly round',
  fathersMiddleName: 'creche following',
  fathersFirstName: 'norm if lest',
  fathersExtName: 'delight who',
  fathersOccupation: 'and over',
  fathersContacts: 'because oof',
  mothersMiddleName: 'gosh',
  mothersFirstName: 'exalted notwithstanding',
  mothersOccupation: 'suspiciously yippee bah',
  mothersContacts: 'tensely',
};

export const sampleWithFullData: IStudent = {
  id: 5124,
  lrn: 'inasmuch treasured derby',
  firstName: 'Rashad',
  middleName: 'ack cuddle meanwhile',
  lastName: 'Kub',
  extName: 'continue',
  birthDate: dayjs('2024-01-03T21:17'),
  birthPlace: 'preference',
  contactNo: 'if jealously',
  address1: 'psst',
  address2: 'blah afore',
  city: 'Hermanport',
  zipCode: '47159',
  country: 'Comoros',
  nationality: 'chord',
  motherTongue: 'wise cosset brown',
  religion: 'combine',
  fathersLastName: 'innocently retouch',
  fathersMiddleName: 'like but even',
  fathersFirstName: 'dock vain',
  fathersExtName: 'churn',
  fathersOccupation: 'indict kindheartedly um',
  fathersContacts: 'recklessly up',
  mothersLastName: 'awe fooey',
  mothersMiddleName: 'hosiery',
  mothersFirstName: 'modulo',
  mothersOccupation: 'bloomer mmm well-off',
  mothersContacts: 'elegantly mismatch guard',
  guardianFullName: 'anenst at consequently',
  guardianContacts: 'expansionism',
};

export const sampleWithNewData: NewStudent = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
