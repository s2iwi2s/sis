import dayjs from 'dayjs/esm';

import { IStudent, NewStudent } from './student.model';

export const sampleWithRequiredData: IStudent = {
  id: 15380,
};

export const sampleWithPartialData: IStudent = {
  id: 19465,
  lrn: 'why save',
  middleName: 'wildly',
  lastName: 'Stokes',
  birthDate: dayjs('2026-07-02T18:17'),
  birthPlace: 'jet kookily eek',
  address1: 'pish kiddingly',
  address2: 'schematise',
  city: 'Port Pedrocester',
  zipCode: '21501',
  motherTongue: 'pluck',
  fathersLastName: 'sinful',
  fathersMiddleName: 'advertisement past',
  fathersExtName: 'aha a reorganisation',
  mothersFirstName: 'camouflage',
  mothersOccupation: 'ugh pretend wilt',
  guardianContacts: 'fooey',
  createdBy: 'lowball behind',
  createdDate: dayjs('2026-07-02T13:41'),
  lastModifiedBy: 'yowza',
  lastModifiedDate: dayjs('2026-07-02T01:41'),
};

export const sampleWithFullData: IStudent = {
  id: 6617,
  lrn: 'pleasant plain petty',
  firstName: 'Laury',
  middleName: 'till',
  lastName: 'Hagenes',
  extName: 'fuel pish',
  birthDate: dayjs('2026-07-01T21:59'),
  birthPlace: 'specific',
  contactNo: 'whoa since',
  address1: 'hefty hungry',
  address2: 'persecute meh',
  city: 'Lake Javierfield',
  zipCode: '64058-3352',
  country: 'Botswana',
  nationality: 'but er',
  motherTongue: 'ugh sore',
  religion: 'breed pension',
  fathersLastName: 'redesign staid',
  fathersMiddleName: 'supposing waist milestone',
  fathersFirstName: 'violently',
  fathersExtName: 'pause',
  fathersOccupation: 'twine railway ceramic',
  fathersContacts: 'abaft tromp',
  mothersLastName: 'tabulate',
  mothersMiddleName: 'pilot boohoo now',
  mothersFirstName: 'over',
  mothersOccupation: 'entwine ripe',
  mothersContacts: 'aha',
  guardianFullName: 'major deflate',
  guardianContacts: 'nippy only',
  createdBy: 'often mmm er',
  createdDate: dayjs('2026-07-02T16:26'),
  lastModifiedBy: 'emulsify silky absent',
  lastModifiedDate: dayjs('2026-07-02T21:42'),
};

export const sampleWithNewData: NewStudent = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
