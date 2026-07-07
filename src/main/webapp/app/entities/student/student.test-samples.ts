import dayjs from 'dayjs/esm';

import { IStudent, NewStudent } from './student.model';

export const sampleWithRequiredData: IStudent = {
  id: 15380,
};

export const sampleWithPartialData: IStudent = {
  id: 18972,
  lrn: 'yowza',
  middleName: 'like although successfully',
  lastName: 'Jacobs',
  enrollmentDate: dayjs('2026-07-06T02:34'),
  birthDate: dayjs('2026-07-05T23:12'),
  contactNo: 'secularize a',
  address1: 'kooky supposing alongside',
  address2: 'correctly furthermore helplessly',
  city: 'West Peter',
  nationality: 'advertisement past',
  religion: 'aha a reorganisation',
  fathersLastName: 'camouflage',
  fathersFirstName: 'ugh pretend wilt',
  mothersMiddleName: 'fooey',
  mothersFirstName: 'lowball behind',
  guardianFullName: 'since bug',
  guardianContacts: 'tame',
  createdBy: 'yawningly fussy steep',
  createdDate: dayjs('2026-07-06T12:33'),
  lastModifiedBy: 'overproduce skean since',
};

export const sampleWithFullData: IStudent = {
  id: 6617,
  lrn: 'pleasant plain petty',
  firstName: 'Laury',
  middleName: 'till',
  lastName: 'Hagenes',
  extName: 'fuel pish',
  enrollmentDate: dayjs('2026-07-05T15:11'),
  birthDate: dayjs('2026-07-05T18:09'),
  birthPlace: 'noteworthy whoa',
  contactNo: 'so hefty hun',
  address1: 'persecute meh',
  address2: 'of',
  city: 'Silviabury',
  zipCode: '52916',
  country: 'Malta',
  nationality: 'angle showy',
  motherTongue: 'drag',
  religion: 'elliptical finally bah',
  fathersLastName: 'permafrost misguided fold',
  fathersMiddleName: 'lock yahoo',
  fathersFirstName: 'under distant incidentally',
  fathersExtName: 'between allegation',
  fathersOccupation: 'that intensely',
  fathersContacts: 'zen near',
  mothersLastName: 'amid',
  mothersMiddleName: 'among right truthfully',
  mothersFirstName: 'yearningly netsuke major',
  mothersOccupation: 'humor nippy',
  mothersContacts: 'stingy often mmm',
  guardianFullName: 'saw youthfully bah',
  guardianContacts: 'absent primary bleak',
  createdBy: 'see',
  createdDate: dayjs('2026-07-06T11:21'),
  lastModifiedBy: 'uneven minority',
  lastModifiedDate: dayjs('2026-07-06T10:17'),
};

export const sampleWithNewData: NewStudent = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
