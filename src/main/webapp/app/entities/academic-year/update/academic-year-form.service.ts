import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAcademicYear, NewAcademicYear } from '../academic-year.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAcademicYear for edit and NewAcademicYearFormGroupInput for create.
 */
type AcademicYearFormGroupInput = IAcademicYear | PartialWithRequiredKeyOf<NewAcademicYear>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IAcademicYear | NewAcademicYear> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type AcademicYearFormRawValue = FormValueOf<IAcademicYear>;

type NewAcademicYearFormRawValue = FormValueOf<NewAcademicYear>;

type AcademicYearFormDefaults = Pick<NewAcademicYear, 'id' | 'current' | 'createdDate' | 'lastModifiedDate'>;

type AcademicYearFormGroupContent = {
  id: FormControl<AcademicYearFormRawValue['id'] | NewAcademicYear['id']>;
  name: FormControl<AcademicYearFormRawValue['name']>;
  code: FormControl<AcademicYearFormRawValue['code']>;
  startDate: FormControl<AcademicYearFormRawValue['startDate']>;
  endDate: FormControl<AcademicYearFormRawValue['endDate']>;
  current: FormControl<AcademicYearFormRawValue['current']>;
  createdBy: FormControl<AcademicYearFormRawValue['createdBy']>;
  createdDate: FormControl<AcademicYearFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<AcademicYearFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<AcademicYearFormRawValue['lastModifiedDate']>;
};

export type AcademicYearFormGroup = FormGroup<AcademicYearFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AcademicYearFormService {
  createAcademicYearFormGroup(academicYear?: AcademicYearFormGroupInput): AcademicYearFormGroup {
    const academicYearRawValue = this.convertAcademicYearToAcademicYearRawValue({
      ...this.getFormDefaults(),
      ...(academicYear ?? { id: null }),
    });
    return new FormGroup<AcademicYearFormGroupContent>({
      id: new FormControl(
        { value: academicYearRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(academicYearRawValue.name),
      code: new FormControl(academicYearRawValue.code),
      startDate: new FormControl(academicYearRawValue.startDate),
      endDate: new FormControl(academicYearRawValue.endDate),
      current: new FormControl(academicYearRawValue.current),
      createdBy: new FormControl(academicYearRawValue.createdBy, {
        validators: [Validators.maxLength(50)],
      }),
      createdDate: new FormControl(academicYearRawValue.createdDate),
      lastModifiedBy: new FormControl(academicYearRawValue.lastModifiedBy, {
        validators: [Validators.maxLength(50)],
      }),
      lastModifiedDate: new FormControl(academicYearRawValue.lastModifiedDate),
    });
  }

  getAcademicYear(form: AcademicYearFormGroup): IAcademicYear | NewAcademicYear {
    return this.convertAcademicYearRawValueToAcademicYear(form.getRawValue());
  }

  resetForm(form: AcademicYearFormGroup, academicYear: AcademicYearFormGroupInput): void {
    const academicYearRawValue = this.convertAcademicYearToAcademicYearRawValue({ ...this.getFormDefaults(), ...academicYear });
    form.reset({
      ...academicYearRawValue,
      id: { value: academicYearRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): AcademicYearFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      current: false,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertAcademicYearRawValueToAcademicYear(
    rawAcademicYear: AcademicYearFormRawValue | NewAcademicYearFormRawValue,
  ): IAcademicYear | NewAcademicYear {
    return {
      ...rawAcademicYear,
      createdDate: dayjs(rawAcademicYear.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawAcademicYear.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertAcademicYearToAcademicYearRawValue(
    academicYear: IAcademicYear | (Partial<NewAcademicYear> & AcademicYearFormDefaults),
  ): AcademicYearFormRawValue | PartialWithRequiredKeyOf<NewAcademicYearFormRawValue> {
    return {
      ...academicYear,
      createdDate: academicYear.createdDate ? academicYear.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: academicYear.lastModifiedDate ? academicYear.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
