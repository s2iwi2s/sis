import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../academic-terms.test-samples';

import { AcademicTermsFormService } from './academic-terms-form.service';

describe('AcademicTerms Form Service', () => {
  let service: AcademicTermsFormService;

  beforeEach(() => {
    service = TestBed.inject(AcademicTermsFormService);
  });

  describe('Service methods', () => {
    describe('createAcademicTermsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAcademicTermsFormGroup();

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
            year: expect.any(Object),
          }),
        );
      });

      it('passing IAcademicTerms should create a new form with FormGroup', () => {
        const formGroup = service.createAcademicTermsFormGroup(sampleWithRequiredData);

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
            year: expect.any(Object),
          }),
        );
      });
    });

    describe('getAcademicTerms', () => {
      it('should return NewAcademicTerms for default AcademicTerms initial value', () => {
        const formGroup = service.createAcademicTermsFormGroup(sampleWithNewData);

        const academicTerms = service.getAcademicTerms(formGroup);

        expect(academicTerms).toMatchObject(sampleWithNewData);
      });

      it('should return NewAcademicTerms for empty AcademicTerms initial value', () => {
        const formGroup = service.createAcademicTermsFormGroup();

        const academicTerms = service.getAcademicTerms(formGroup);

        expect(academicTerms).toMatchObject({});
      });

      it('should return IAcademicTerms', () => {
        const formGroup = service.createAcademicTermsFormGroup(sampleWithRequiredData);

        const academicTerms = service.getAcademicTerms(formGroup);

        expect(academicTerms).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAcademicTerms should not enable id FormControl', () => {
        const formGroup = service.createAcademicTermsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAcademicTerms should disable id FormControl', () => {
        const formGroup = service.createAcademicTermsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
