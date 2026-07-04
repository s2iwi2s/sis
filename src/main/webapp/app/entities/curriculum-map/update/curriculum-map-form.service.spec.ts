import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../curriculum-map.test-samples';

import { CurriculumMapFormService } from './curriculum-map-form.service';

describe('CurriculumMap Form Service', () => {
  let service: CurriculumMapFormService;

  beforeEach(() => {
    service = TestBed.inject(CurriculumMapFormService);
  });

  describe('Service methods', () => {
    describe('createCurriculumMapFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCurriculumMapFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            quarterNo: expect.any(Object),
            weekNo: expect.any(Object),
            topic: expect.any(Object),
            contentStandards: expect.any(Object),
            performanceStandards: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            course: expect.any(Object),
          }),
        );
      });

      it('passing ICurriculumMap should create a new form with FormGroup', () => {
        const formGroup = service.createCurriculumMapFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            quarterNo: expect.any(Object),
            weekNo: expect.any(Object),
            topic: expect.any(Object),
            contentStandards: expect.any(Object),
            performanceStandards: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            course: expect.any(Object),
          }),
        );
      });
    });

    describe('getCurriculumMap', () => {
      it('should return NewCurriculumMap for default CurriculumMap initial value', () => {
        const formGroup = service.createCurriculumMapFormGroup(sampleWithNewData);

        const curriculumMap = service.getCurriculumMap(formGroup);

        expect(curriculumMap).toMatchObject(sampleWithNewData);
      });

      it('should return NewCurriculumMap for empty CurriculumMap initial value', () => {
        const formGroup = service.createCurriculumMapFormGroup();

        const curriculumMap = service.getCurriculumMap(formGroup);

        expect(curriculumMap).toMatchObject({});
      });

      it('should return ICurriculumMap', () => {
        const formGroup = service.createCurriculumMapFormGroup(sampleWithRequiredData);

        const curriculumMap = service.getCurriculumMap(formGroup);

        expect(curriculumMap).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICurriculumMap should not enable id FormControl', () => {
        const formGroup = service.createCurriculumMapFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCurriculumMap should disable id FormControl', () => {
        const formGroup = service.createCurriculumMapFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
