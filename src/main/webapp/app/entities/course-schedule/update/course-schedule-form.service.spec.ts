import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../course-schedule.test-samples';

import { CourseScheduleFormService } from './course-schedule-form.service';

describe('CourseSchedule Form Service', () => {
  let service: CourseScheduleFormService;

  beforeEach(() => {
    service = TestBed.inject(CourseScheduleFormService);
  });

  describe('Service methods', () => {
    describe('createCourseScheduleFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCourseScheduleFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            room: expect.any(Object),
            weekDay: expect.any(Object),
            startTime: expect.any(Object),
            endTime: expect.any(Object),
            description: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            terms: expect.any(Object),
            year: expect.any(Object),
            classSchedule: expect.any(Object),
            students: expect.any(Object),
            instructors: expect.any(Object),
          }),
        );
      });

      it('passing ICourseSchedule should create a new form with FormGroup', () => {
        const formGroup = service.createCourseScheduleFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            room: expect.any(Object),
            weekDay: expect.any(Object),
            startTime: expect.any(Object),
            endTime: expect.any(Object),
            description: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            terms: expect.any(Object),
            year: expect.any(Object),
            classSchedule: expect.any(Object),
            students: expect.any(Object),
            instructors: expect.any(Object),
          }),
        );
      });
    });

    describe('getCourseSchedule', () => {
      it('should return NewCourseSchedule for default CourseSchedule initial value', () => {
        const formGroup = service.createCourseScheduleFormGroup(sampleWithNewData);

        const courseSchedule = service.getCourseSchedule(formGroup);

        expect(courseSchedule).toMatchObject(sampleWithNewData);
      });

      it('should return NewCourseSchedule for empty CourseSchedule initial value', () => {
        const formGroup = service.createCourseScheduleFormGroup();

        const courseSchedule = service.getCourseSchedule(formGroup);

        expect(courseSchedule).toMatchObject({});
      });

      it('should return ICourseSchedule', () => {
        const formGroup = service.createCourseScheduleFormGroup(sampleWithRequiredData);

        const courseSchedule = service.getCourseSchedule(formGroup);

        expect(courseSchedule).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICourseSchedule should not enable id FormControl', () => {
        const formGroup = service.createCourseScheduleFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCourseSchedule should disable id FormControl', () => {
        const formGroup = service.createCourseScheduleFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
