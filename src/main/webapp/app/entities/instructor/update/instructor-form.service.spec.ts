import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../instructor.test-samples';

import { InstructorFormService } from './instructor-form.service';

describe('Instructor Form Service', () => {
  let service: InstructorFormService;

  beforeEach(() => {
    service = TestBed.inject(InstructorFormService);
  });

  describe('Service methods', () => {
    describe('createInstructorFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createInstructorFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            firstName: expect.any(Object),
            middleName: expect.any(Object),
            lastName: expect.any(Object),
            email: expect.any(Object),
            phoneNumber: expect.any(Object),
            hireDate: expect.any(Object),
            salary: expect.any(Object),
            commissionPct: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            gender: expect.any(Object),
            user: expect.any(Object),
            courseSchedules: expect.any(Object),
          }),
        );
      });

      it('passing IInstructor should create a new form with FormGroup', () => {
        const formGroup = service.createInstructorFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            firstName: expect.any(Object),
            middleName: expect.any(Object),
            lastName: expect.any(Object),
            email: expect.any(Object),
            phoneNumber: expect.any(Object),
            hireDate: expect.any(Object),
            salary: expect.any(Object),
            commissionPct: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            gender: expect.any(Object),
            user: expect.any(Object),
            courseSchedules: expect.any(Object),
          }),
        );
      });
    });

    describe('getInstructor', () => {
      it('should return NewInstructor for default Instructor initial value', () => {
        const formGroup = service.createInstructorFormGroup(sampleWithNewData);

        const instructor = service.getInstructor(formGroup);

        expect(instructor).toMatchObject(sampleWithNewData);
      });

      it('should return NewInstructor for empty Instructor initial value', () => {
        const formGroup = service.createInstructorFormGroup();

        const instructor = service.getInstructor(formGroup);

        expect(instructor).toMatchObject({});
      });

      it('should return IInstructor', () => {
        const formGroup = service.createInstructorFormGroup(sampleWithRequiredData);

        const instructor = service.getInstructor(formGroup);

        expect(instructor).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IInstructor should not enable id FormControl', () => {
        const formGroup = service.createInstructorFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewInstructor should disable id FormControl', () => {
        const formGroup = service.createInstructorFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
