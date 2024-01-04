import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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

type CourseFormDefaults = Pick<NewCourse, 'id' | 'instructors' | 'students'>;

type CourseFormGroupContent = {
  id: FormControl<ICourse['id'] | NewCourse['id']>;
  gradelevel: FormControl<ICourse['gradelevel']>;
  subject: FormControl<ICourse['subject']>;
  hoursPerQuarter: FormControl<ICourse['hoursPerQuarter']>;
  courseDescription: FormControl<ICourse['courseDescription']>;
  courseObjectives: FormControl<ICourse['courseObjectives']>;
  schYr: FormControl<ICourse['schYr']>;
  instructors: FormControl<ICourse['instructors']>;
  students: FormControl<ICourse['students']>;
};

export type CourseFormGroup = FormGroup<CourseFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CourseFormService {
  createCourseFormGroup(course: CourseFormGroupInput = { id: null }): CourseFormGroup {
    const courseRawValue = {
      ...this.getFormDefaults(),
      ...course,
    };
    return new FormGroup<CourseFormGroupContent>({
      id: new FormControl(
        { value: courseRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      gradelevel: new FormControl(courseRawValue.gradelevel, {
        validators: [Validators.maxLength(50)],
      }),
      subject: new FormControl(courseRawValue.subject, {
        validators: [Validators.maxLength(50)],
      }),
      hoursPerQuarter: new FormControl(courseRawValue.hoursPerQuarter),
      courseDescription: new FormControl(courseRawValue.courseDescription),
      courseObjectives: new FormControl(courseRawValue.courseObjectives),
      schYr: new FormControl(courseRawValue.schYr),
      instructors: new FormControl(courseRawValue.instructors ?? []),
      students: new FormControl(courseRawValue.students ?? []),
    });
  }

  getCourse(form: CourseFormGroup): ICourse | NewCourse {
    return form.getRawValue() as ICourse | NewCourse;
  }

  resetForm(form: CourseFormGroup, course: CourseFormGroupInput): void {
    const courseRawValue = { ...this.getFormDefaults(), ...course };
    form.reset(
      {
        ...courseRawValue,
        id: { value: courseRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CourseFormDefaults {
    return {
      id: null,
      instructors: [],
      students: [],
    };
  }
}
