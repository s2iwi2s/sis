import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICourse, NewCourse } from '../course.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICourse for edit and NewCourseFormGroupInput for create.
 */
type CourseFormGroupInput = ICourse | PartialWithRequiredKeyOf<NewCourse>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ICourse | NewCourse> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type CourseFormRawValue = FormValueOf<ICourse>;

type NewCourseFormRawValue = FormValueOf<NewCourse>;

type CourseFormDefaults = Pick<NewCourse, 'id' | 'createdDate' | 'lastModifiedDate'>;

type CourseFormGroupContent = {
  id: FormControl<CourseFormRawValue['id'] | NewCourse['id']>;
  subject: FormControl<CourseFormRawValue['subject']>;
  hoursPerQuarter: FormControl<CourseFormRawValue['hoursPerQuarter']>;
  courseDescription: FormControl<CourseFormRawValue['courseDescription']>;
  courseObjectives: FormControl<CourseFormRawValue['courseObjectives']>;
  createdBy: FormControl<CourseFormRawValue['createdBy']>;
  createdDate: FormControl<CourseFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<CourseFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<CourseFormRawValue['lastModifiedDate']>;
  gradelevel: FormControl<CourseFormRawValue['gradelevel']>;
  department: FormControl<CourseFormRawValue['department']>;
  year: FormControl<CourseFormRawValue['year']>;
  terms: FormControl<CourseFormRawValue['terms']>;
};

export type CourseFormGroup = FormGroup<CourseFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CourseFormService {
  createCourseFormGroup(course?: CourseFormGroupInput): CourseFormGroup {
    const courseRawValue = this.convertCourseToCourseRawValue({
      ...this.getFormDefaults(),
      ...(course ?? { id: null }),
    });
    return new FormGroup<CourseFormGroupContent>({
      id: new FormControl(
        { value: courseRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      subject: new FormControl(courseRawValue.subject, {
        validators: [Validators.maxLength(50)],
      }),
      hoursPerQuarter: new FormControl(courseRawValue.hoursPerQuarter),
      courseDescription: new FormControl(courseRawValue.courseDescription),
      courseObjectives: new FormControl(courseRawValue.courseObjectives),
      createdBy: new FormControl(courseRawValue.createdBy, {
        validators: [Validators.maxLength(50)],
      }),
      createdDate: new FormControl(courseRawValue.createdDate),
      lastModifiedBy: new FormControl(courseRawValue.lastModifiedBy, {
        validators: [Validators.maxLength(50)],
      }),
      lastModifiedDate: new FormControl(courseRawValue.lastModifiedDate),
      gradelevel: new FormControl(courseRawValue.gradelevel),
      department: new FormControl(courseRawValue.department),
      year: new FormControl(courseRawValue.year),
      terms: new FormControl(courseRawValue.terms),
    });
  }

  getCourse(form: CourseFormGroup): ICourse | NewCourse {
    return this.convertCourseRawValueToCourse(form.getRawValue());
  }

  resetForm(form: CourseFormGroup, course: CourseFormGroupInput): void {
    const courseRawValue = this.convertCourseToCourseRawValue({ ...this.getFormDefaults(), ...course });
    form.reset({
      ...courseRawValue,
      id: { value: courseRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): CourseFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertCourseRawValueToCourse(rawCourse: CourseFormRawValue | NewCourseFormRawValue): ICourse | NewCourse {
    return {
      ...rawCourse,
      createdDate: dayjs(rawCourse.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawCourse.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertCourseToCourseRawValue(
    course: ICourse | (Partial<NewCourse> & CourseFormDefaults),
  ): CourseFormRawValue | PartialWithRequiredKeyOf<NewCourseFormRawValue> {
    return {
      ...course,
      createdDate: course.createdDate ? course.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: course.lastModifiedDate ? course.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
