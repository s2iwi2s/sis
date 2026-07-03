import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../student.test-samples';

import { StudentFormService } from './student-form.service';

describe('Student Form Service', () => {
  let service: StudentFormService;

  beforeEach(() => {
    service = TestBed.inject(StudentFormService);
  });

  describe('Service methods', () => {
    describe('createStudentFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createStudentFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            lrn: expect.any(Object),
            firstName: expect.any(Object),
            middleName: expect.any(Object),
            lastName: expect.any(Object),
            extName: expect.any(Object),
            birthDate: expect.any(Object),
            birthPlace: expect.any(Object),
            contactNo: expect.any(Object),
            address1: expect.any(Object),
            address2: expect.any(Object),
            city: expect.any(Object),
            zipCode: expect.any(Object),
            country: expect.any(Object),
            nationality: expect.any(Object),
            motherTongue: expect.any(Object),
            religion: expect.any(Object),
            fathersLastName: expect.any(Object),
            fathersMiddleName: expect.any(Object),
            fathersFirstName: expect.any(Object),
            fathersExtName: expect.any(Object),
            fathersOccupation: expect.any(Object),
            fathersContacts: expect.any(Object),
            mothersLastName: expect.any(Object),
            mothersMiddleName: expect.any(Object),
            mothersFirstName: expect.any(Object),
            mothersOccupation: expect.any(Object),
            mothersContacts: expect.any(Object),
            guardianFullName: expect.any(Object),
            guardianContacts: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            gender: expect.any(Object),
            user: expect.any(Object),
          }),
        );
      });

      it('passing IStudent should create a new form with FormGroup', () => {
        const formGroup = service.createStudentFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            lrn: expect.any(Object),
            firstName: expect.any(Object),
            middleName: expect.any(Object),
            lastName: expect.any(Object),
            extName: expect.any(Object),
            birthDate: expect.any(Object),
            birthPlace: expect.any(Object),
            contactNo: expect.any(Object),
            address1: expect.any(Object),
            address2: expect.any(Object),
            city: expect.any(Object),
            zipCode: expect.any(Object),
            country: expect.any(Object),
            nationality: expect.any(Object),
            motherTongue: expect.any(Object),
            religion: expect.any(Object),
            fathersLastName: expect.any(Object),
            fathersMiddleName: expect.any(Object),
            fathersFirstName: expect.any(Object),
            fathersExtName: expect.any(Object),
            fathersOccupation: expect.any(Object),
            fathersContacts: expect.any(Object),
            mothersLastName: expect.any(Object),
            mothersMiddleName: expect.any(Object),
            mothersFirstName: expect.any(Object),
            mothersOccupation: expect.any(Object),
            mothersContacts: expect.any(Object),
            guardianFullName: expect.any(Object),
            guardianContacts: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            gender: expect.any(Object),
            user: expect.any(Object),
          }),
        );
      });
    });

    describe('getStudent', () => {
      it('should return NewStudent for default Student initial value', () => {
        const formGroup = service.createStudentFormGroup(sampleWithNewData);

        const student = service.getStudent(formGroup);

        expect(student).toMatchObject(sampleWithNewData);
      });

      it('should return NewStudent for empty Student initial value', () => {
        const formGroup = service.createStudentFormGroup();

        const student = service.getStudent(formGroup);

        expect(student).toMatchObject({});
      });

      it('should return IStudent', () => {
        const formGroup = service.createStudentFormGroup(sampleWithRequiredData);

        const student = service.getStudent(formGroup);

        expect(student).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IStudent should not enable id FormControl', () => {
        const formGroup = service.createStudentFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewStudent should disable id FormControl', () => {
        const formGroup = service.createStudentFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
