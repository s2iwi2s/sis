import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../class-schedule.test-samples';

import { ClassScheduleFormService } from './class-schedule-form.service';

describe('ClassSchedule Form Service', () => {
  let service: ClassScheduleFormService;

  beforeEach(() => {
    service = TestBed.inject(ClassScheduleFormService);
  });

  describe('Service methods', () => {
    describe('createClassScheduleFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createClassScheduleFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            gradelevel: expect.any(Object),
            terms: expect.any(Object),
            year: expect.any(Object),
          }),
        );
      });

      it('passing IClassSchedule should create a new form with FormGroup', () => {
        const formGroup = service.createClassScheduleFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            gradelevel: expect.any(Object),
            terms: expect.any(Object),
            year: expect.any(Object),
          }),
        );
      });
    });

    describe('getClassSchedule', () => {
      it('should return NewClassSchedule for default ClassSchedule initial value', () => {
        const formGroup = service.createClassScheduleFormGroup(sampleWithNewData);

        const classSchedule = service.getClassSchedule(formGroup);

        expect(classSchedule).toMatchObject(sampleWithNewData);
      });

      it('should return NewClassSchedule for empty ClassSchedule initial value', () => {
        const formGroup = service.createClassScheduleFormGroup();

        const classSchedule = service.getClassSchedule(formGroup);

        expect(classSchedule).toMatchObject({});
      });

      it('should return IClassSchedule', () => {
        const formGroup = service.createClassScheduleFormGroup(sampleWithRequiredData);

        const classSchedule = service.getClassSchedule(formGroup);

        expect(classSchedule).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IClassSchedule should not enable id FormControl', () => {
        const formGroup = service.createClassScheduleFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewClassSchedule should disable id FormControl', () => {
        const formGroup = service.createClassScheduleFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
