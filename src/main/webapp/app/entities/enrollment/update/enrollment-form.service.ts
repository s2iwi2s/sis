import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEnrollment, NewEnrollment } from '../enrollment.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEnrollment for edit and NewEnrollmentFormGroupInput for create.
 */
type EnrollmentFormGroupInput = IEnrollment | PartialWithRequiredKeyOf<NewEnrollment>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IEnrollment | NewEnrollment> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type EnrollmentFormRawValue = FormValueOf<IEnrollment>;

type NewEnrollmentFormRawValue = FormValueOf<NewEnrollment>;

type EnrollmentFormDefaults = Pick<NewEnrollment, 'id' | 'active' | 'createdDate' | 'lastModifiedDate'>;

type EnrollmentFormGroupContent = {
  id: FormControl<EnrollmentFormRawValue['id'] | NewEnrollment['id']>;
  active: FormControl<EnrollmentFormRawValue['active']>;
  createdBy: FormControl<EnrollmentFormRawValue['createdBy']>;
  createdDate: FormControl<EnrollmentFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<EnrollmentFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<EnrollmentFormRawValue['lastModifiedDate']>;
  year: FormControl<EnrollmentFormRawValue['year']>;
  terms: FormControl<EnrollmentFormRawValue['terms']>;
  student: FormControl<EnrollmentFormRawValue['student']>;
};

export type EnrollmentFormGroup = FormGroup<EnrollmentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EnrollmentFormService {
  createEnrollmentFormGroup(enrollment?: EnrollmentFormGroupInput): EnrollmentFormGroup {
    const enrollmentRawValue = this.convertEnrollmentToEnrollmentRawValue({
      ...this.getFormDefaults(),
      ...(enrollment ?? { id: null }),
    });
    return new FormGroup<EnrollmentFormGroupContent>({
      id: new FormControl(
        { value: enrollmentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      active: new FormControl(enrollmentRawValue.active),
      createdBy: new FormControl(enrollmentRawValue.createdBy, {
        validators: [Validators.maxLength(50)],
      }),
      createdDate: new FormControl(enrollmentRawValue.createdDate),
      lastModifiedBy: new FormControl(enrollmentRawValue.lastModifiedBy, {
        validators: [Validators.maxLength(50)],
      }),
      lastModifiedDate: new FormControl(enrollmentRawValue.lastModifiedDate),
      year: new FormControl(enrollmentRawValue.year),
      terms: new FormControl(enrollmentRawValue.terms),
      student: new FormControl(enrollmentRawValue.student),
    });
  }

  getEnrollment(form: EnrollmentFormGroup): IEnrollment | NewEnrollment {
    return this.convertEnrollmentRawValueToEnrollment(form.getRawValue());
  }

  resetForm(form: EnrollmentFormGroup, enrollment: EnrollmentFormGroupInput): void {
    const enrollmentRawValue = this.convertEnrollmentToEnrollmentRawValue({ ...this.getFormDefaults(), ...enrollment });
    form.reset({
      ...enrollmentRawValue,
      id: { value: enrollmentRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): EnrollmentFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      active: false,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertEnrollmentRawValueToEnrollment(
    rawEnrollment: EnrollmentFormRawValue | NewEnrollmentFormRawValue,
  ): IEnrollment | NewEnrollment {
    return {
      ...rawEnrollment,
      createdDate: dayjs(rawEnrollment.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawEnrollment.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertEnrollmentToEnrollmentRawValue(
    enrollment: IEnrollment | (Partial<NewEnrollment> & EnrollmentFormDefaults),
  ): EnrollmentFormRawValue | PartialWithRequiredKeyOf<NewEnrollmentFormRawValue> {
    return {
      ...enrollment,
      createdDate: enrollment.createdDate ? enrollment.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: enrollment.lastModifiedDate ? enrollment.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
