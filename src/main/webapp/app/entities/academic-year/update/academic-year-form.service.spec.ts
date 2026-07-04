import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../academic-year.test-samples';

import { AcademicYearFormService } from './academic-year-form.service';

describe('AcademicYear Form Service', () => {
  let service: AcademicYearFormService;

  beforeEach(() => {
    service = TestBed.inject(AcademicYearFormService);
  });

  describe('Service methods', () => {
    describe('createAcademicYearFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAcademicYearFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            code: expect.any(Object),
            startDate: expect.any(Object),
            endDate: expect.any(Object),
            current: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });

      it('passing IAcademicYear should create a new form with FormGroup', () => {
        const formGroup = service.createAcademicYearFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            code: expect.any(Object),
            startDate: expect.any(Object),
            endDate: expect.any(Object),
            current: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });
    });

    describe('getAcademicYear', () => {
      it('should return NewAcademicYear for default AcademicYear initial value', () => {
        const formGroup = service.createAcademicYearFormGroup(sampleWithNewData);

        const academicYear = service.getAcademicYear(formGroup);

        expect(academicYear).toMatchObject(sampleWithNewData);
      });

      it('should return NewAcademicYear for empty AcademicYear initial value', () => {
        const formGroup = service.createAcademicYearFormGroup();

        const academicYear = service.getAcademicYear(formGroup);

        expect(academicYear).toMatchObject({});
      });

      it('should return IAcademicYear', () => {
        const formGroup = service.createAcademicYearFormGroup(sampleWithRequiredData);

        const academicYear = service.getAcademicYear(formGroup);

        expect(academicYear).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAcademicYear should not enable id FormControl', () => {
        const formGroup = service.createAcademicYearFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAcademicYear should disable id FormControl', () => {
        const formGroup = service.createAcademicYearFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
