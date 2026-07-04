import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../learning-competency.test-samples';

import { LearningCompetencyFormService } from './learning-competency-form.service';

describe('LearningCompetency Form Service', () => {
  let service: LearningCompetencyFormService;

  beforeEach(() => {
    service = TestBed.inject(LearningCompetencyFormService);
  });

  describe('Service methods', () => {
    describe('createLearningCompetencyFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLearningCompetencyFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            seqNo: expect.any(Object),
            competencyCode: expect.any(Object),
            description: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            curriculumMap: expect.any(Object),
          }),
        );
      });

      it('passing ILearningCompetency should create a new form with FormGroup', () => {
        const formGroup = service.createLearningCompetencyFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            seqNo: expect.any(Object),
            competencyCode: expect.any(Object),
            description: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            curriculumMap: expect.any(Object),
          }),
        );
      });
    });

    describe('getLearningCompetency', () => {
      it('should return NewLearningCompetency for default LearningCompetency initial value', () => {
        const formGroup = service.createLearningCompetencyFormGroup(sampleWithNewData);

        const learningCompetency = service.getLearningCompetency(formGroup);

        expect(learningCompetency).toMatchObject(sampleWithNewData);
      });

      it('should return NewLearningCompetency for empty LearningCompetency initial value', () => {
        const formGroup = service.createLearningCompetencyFormGroup();

        const learningCompetency = service.getLearningCompetency(formGroup);

        expect(learningCompetency).toMatchObject({});
      });

      it('should return ILearningCompetency', () => {
        const formGroup = service.createLearningCompetencyFormGroup(sampleWithRequiredData);

        const learningCompetency = service.getLearningCompetency(formGroup);

        expect(learningCompetency).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILearningCompetency should not enable id FormControl', () => {
        const formGroup = service.createLearningCompetencyFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLearningCompetency should disable id FormControl', () => {
        const formGroup = service.createLearningCompetencyFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
