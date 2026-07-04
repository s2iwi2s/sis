import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICourseSchedule, NewCourseSchedule } from '../course-schedule.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICourseSchedule for edit and NewCourseScheduleFormGroupInput for create.
 */
type CourseScheduleFormGroupInput = ICourseSchedule | PartialWithRequiredKeyOf<NewCourseSchedule>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ICourseSchedule | NewCourseSchedule> = Omit<T, 'startTime' | 'endTime' | 'createdDate' | 'lastModifiedDate'> & {
  startTime?: string | null;
  endTime?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type CourseScheduleFormRawValue = FormValueOf<ICourseSchedule>;

type NewCourseScheduleFormRawValue = FormValueOf<NewCourseSchedule>;

type CourseScheduleFormDefaults = Pick<NewCourseSchedule, 'id' | 'startTime' | 'endTime' | 'createdDate' | 'lastModifiedDate'>;

type CourseScheduleFormGroupContent = {
  id: FormControl<CourseScheduleFormRawValue['id'] | NewCourseSchedule['id']>;
  room: FormControl<CourseScheduleFormRawValue['room']>;
  weekDay: FormControl<CourseScheduleFormRawValue['weekDay']>;
  startTime: FormControl<CourseScheduleFormRawValue['startTime']>;
  endTime: FormControl<CourseScheduleFormRawValue['endTime']>;
  description: FormControl<CourseScheduleFormRawValue['description']>;
  createdBy: FormControl<CourseScheduleFormRawValue['createdBy']>;
  createdDate: FormControl<CourseScheduleFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<CourseScheduleFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<CourseScheduleFormRawValue['lastModifiedDate']>;
  terms: FormControl<CourseScheduleFormRawValue['terms']>;
  year: FormControl<CourseScheduleFormRawValue['year']>;
  instructor: FormControl<CourseScheduleFormRawValue['instructor']>;
  student: FormControl<CourseScheduleFormRawValue['student']>;
};

export type CourseScheduleFormGroup = FormGroup<CourseScheduleFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CourseScheduleFormService {
  createCourseScheduleFormGroup(courseSchedule?: CourseScheduleFormGroupInput): CourseScheduleFormGroup {
    const courseScheduleRawValue = this.convertCourseScheduleToCourseScheduleRawValue({
      ...this.getFormDefaults(),
      ...(courseSchedule ?? { id: null }),
    });
    return new FormGroup<CourseScheduleFormGroupContent>({
      id: new FormControl(
        { value: courseScheduleRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      room: new FormControl(courseScheduleRawValue.room, {
        validators: [Validators.maxLength(50)],
      }),
      weekDay: new FormControl(courseScheduleRawValue.weekDay),
      startTime: new FormControl(courseScheduleRawValue.startTime),
      endTime: new FormControl(courseScheduleRawValue.endTime),
      description: new FormControl(courseScheduleRawValue.description, {
        validators: [Validators.maxLength(250)],
      }),
      createdBy: new FormControl(courseScheduleRawValue.createdBy, {
        validators: [Validators.maxLength(50)],
      }),
      createdDate: new FormControl(courseScheduleRawValue.createdDate),
      lastModifiedBy: new FormControl(courseScheduleRawValue.lastModifiedBy, {
        validators: [Validators.maxLength(50)],
      }),
      lastModifiedDate: new FormControl(courseScheduleRawValue.lastModifiedDate),
      terms: new FormControl(courseScheduleRawValue.terms),
      year: new FormControl(courseScheduleRawValue.year),
      instructor: new FormControl(courseScheduleRawValue.instructor),
      student: new FormControl(courseScheduleRawValue.student),
    });
  }

  getCourseSchedule(form: CourseScheduleFormGroup): ICourseSchedule | NewCourseSchedule {
    return this.convertCourseScheduleRawValueToCourseSchedule(form.getRawValue());
  }

  resetForm(form: CourseScheduleFormGroup, courseSchedule: CourseScheduleFormGroupInput): void {
    const courseScheduleRawValue = this.convertCourseScheduleToCourseScheduleRawValue({ ...this.getFormDefaults(), ...courseSchedule });
    form.reset({
      ...courseScheduleRawValue,
      id: { value: courseScheduleRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): CourseScheduleFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startTime: currentTime,
      endTime: currentTime,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertCourseScheduleRawValueToCourseSchedule(
    rawCourseSchedule: CourseScheduleFormRawValue | NewCourseScheduleFormRawValue,
  ): ICourseSchedule | NewCourseSchedule {
    return {
      ...rawCourseSchedule,
      startTime: dayjs(rawCourseSchedule.startTime, DATE_TIME_FORMAT),
      endTime: dayjs(rawCourseSchedule.endTime, DATE_TIME_FORMAT),
      createdDate: dayjs(rawCourseSchedule.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawCourseSchedule.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertCourseScheduleToCourseScheduleRawValue(
    courseSchedule: ICourseSchedule | (Partial<NewCourseSchedule> & CourseScheduleFormDefaults),
  ): CourseScheduleFormRawValue | PartialWithRequiredKeyOf<NewCourseScheduleFormRawValue> {
    return {
      ...courseSchedule,
      startTime: courseSchedule.startTime ? courseSchedule.startTime.format(DATE_TIME_FORMAT) : undefined,
      endTime: courseSchedule.endTime ? courseSchedule.endTime.format(DATE_TIME_FORMAT) : undefined,
      createdDate: courseSchedule.createdDate ? courseSchedule.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: courseSchedule.lastModifiedDate ? courseSchedule.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
