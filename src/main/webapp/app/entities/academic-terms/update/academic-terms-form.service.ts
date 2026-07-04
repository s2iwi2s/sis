import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAcademicTerms, NewAcademicTerms } from '../academic-terms.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAcademicTerms for edit and NewAcademicTermsFormGroupInput for create.
 */
type AcademicTermsFormGroupInput = IAcademicTerms | PartialWithRequiredKeyOf<NewAcademicTerms>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IAcademicTerms | NewAcademicTerms> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type AcademicTermsFormRawValue = FormValueOf<IAcademicTerms>;

type NewAcademicTermsFormRawValue = FormValueOf<NewAcademicTerms>;

type AcademicTermsFormDefaults = Pick<NewAcademicTerms, 'id' | 'current' | 'createdDate' | 'lastModifiedDate'>;

type AcademicTermsFormGroupContent = {
  id: FormControl<AcademicTermsFormRawValue['id'] | NewAcademicTerms['id']>;
  name: FormControl<AcademicTermsFormRawValue['name']>;
  code: FormControl<AcademicTermsFormRawValue['code']>;
  startDate: FormControl<AcademicTermsFormRawValue['startDate']>;
  endDate: FormControl<AcademicTermsFormRawValue['endDate']>;
  current: FormControl<AcademicTermsFormRawValue['current']>;
  createdBy: FormControl<AcademicTermsFormRawValue['createdBy']>;
  createdDate: FormControl<AcademicTermsFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<AcademicTermsFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<AcademicTermsFormRawValue['lastModifiedDate']>;
  year: FormControl<AcademicTermsFormRawValue['year']>;
};

export type AcademicTermsFormGroup = FormGroup<AcademicTermsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AcademicTermsFormService {
  createAcademicTermsFormGroup(academicTerms?: AcademicTermsFormGroupInput): AcademicTermsFormGroup {
    const academicTermsRawValue = this.convertAcademicTermsToAcademicTermsRawValue({
      ...this.getFormDefaults(),
      ...(academicTerms ?? { id: null }),
    });
    return new FormGroup<AcademicTermsFormGroupContent>({
      id: new FormControl(
        { value: academicTermsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(academicTermsRawValue.name),
      code: new FormControl(academicTermsRawValue.code),
      startDate: new FormControl(academicTermsRawValue.startDate),
      endDate: new FormControl(academicTermsRawValue.endDate),
      current: new FormControl(academicTermsRawValue.current),
      createdBy: new FormControl(academicTermsRawValue.createdBy, {
        validators: [Validators.maxLength(50)],
      }),
      createdDate: new FormControl(academicTermsRawValue.createdDate),
      lastModifiedBy: new FormControl(academicTermsRawValue.lastModifiedBy, {
        validators: [Validators.maxLength(50)],
      }),
      lastModifiedDate: new FormControl(academicTermsRawValue.lastModifiedDate),
      year: new FormControl(academicTermsRawValue.year),
    });
  }

  getAcademicTerms(form: AcademicTermsFormGroup): IAcademicTerms | NewAcademicTerms {
    return this.convertAcademicTermsRawValueToAcademicTerms(form.getRawValue());
  }

  resetForm(form: AcademicTermsFormGroup, academicTerms: AcademicTermsFormGroupInput): void {
    const academicTermsRawValue = this.convertAcademicTermsToAcademicTermsRawValue({ ...this.getFormDefaults(), ...academicTerms });
    form.reset({
      ...academicTermsRawValue,
      id: { value: academicTermsRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): AcademicTermsFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      current: false,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertAcademicTermsRawValueToAcademicTerms(
    rawAcademicTerms: AcademicTermsFormRawValue | NewAcademicTermsFormRawValue,
  ): IAcademicTerms | NewAcademicTerms {
    return {
      ...rawAcademicTerms,
      createdDate: dayjs(rawAcademicTerms.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawAcademicTerms.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertAcademicTermsToAcademicTermsRawValue(
    academicTerms: IAcademicTerms | (Partial<NewAcademicTerms> & AcademicTermsFormDefaults),
  ): AcademicTermsFormRawValue | PartialWithRequiredKeyOf<NewAcademicTermsFormRawValue> {
    return {
      ...academicTerms,
      createdDate: academicTerms.createdDate ? academicTerms.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: academicTerms.lastModifiedDate ? academicTerms.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
