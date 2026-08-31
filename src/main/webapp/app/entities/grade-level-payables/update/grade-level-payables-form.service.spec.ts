import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../grade-level-payables.test-samples';

import { GradeLevelPayablesFormService } from './grade-level-payables-form.service';

describe('GradeLevelPayables Form Service', () => {
  let service: GradeLevelPayablesFormService;

  beforeEach(() => {
    service = TestBed.inject(GradeLevelPayablesFormService);
  });

  describe('Service methods', () => {
    describe('createGradeLevelPayablesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createGradeLevelPayablesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            active: expect.any(Object),
            gradelevel: expect.any(Object),
          }),
        );
      });

      it('passing IGradeLevelPayables should create a new form with FormGroup', () => {
        const formGroup = service.createGradeLevelPayablesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            active: expect.any(Object),
            gradelevel: expect.any(Object),
          }),
        );
      });
    });

    describe('getGradeLevelPayables', () => {
      it('should return NewGradeLevelPayables for default GradeLevelPayables initial value', () => {
        const formGroup = service.createGradeLevelPayablesFormGroup(sampleWithNewData);

        const gradeLevelPayables = service.getGradeLevelPayables(formGroup);

        expect(gradeLevelPayables).toMatchObject(sampleWithNewData);
      });

      it('should return NewGradeLevelPayables for empty GradeLevelPayables initial value', () => {
        const formGroup = service.createGradeLevelPayablesFormGroup();

        const gradeLevelPayables = service.getGradeLevelPayables(formGroup);

        expect(gradeLevelPayables).toMatchObject({});
      });

      it('should return IGradeLevelPayables', () => {
        const formGroup = service.createGradeLevelPayablesFormGroup(sampleWithRequiredData);

        const gradeLevelPayables = service.getGradeLevelPayables(formGroup);

        expect(gradeLevelPayables).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IGradeLevelPayables should not enable id FormControl', () => {
        const formGroup = service.createGradeLevelPayablesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewGradeLevelPayables should disable id FormControl', () => {
        const formGroup = service.createGradeLevelPayablesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
