import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICurriculumMap, NewCurriculumMap } from '../curriculum-map.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICurriculumMap for edit and NewCurriculumMapFormGroupInput for create.
 */
type CurriculumMapFormGroupInput = ICurriculumMap | PartialWithRequiredKeyOf<NewCurriculumMap>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ICurriculumMap | NewCurriculumMap> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type CurriculumMapFormRawValue = FormValueOf<ICurriculumMap>;

type NewCurriculumMapFormRawValue = FormValueOf<NewCurriculumMap>;

type CurriculumMapFormDefaults = Pick<NewCurriculumMap, 'id' | 'createdDate' | 'lastModifiedDate'>;

type CurriculumMapFormGroupContent = {
  id: FormControl<CurriculumMapFormRawValue['id'] | NewCurriculumMap['id']>;
  quarterNo: FormControl<CurriculumMapFormRawValue['quarterNo']>;
  weekNo: FormControl<CurriculumMapFormRawValue['weekNo']>;
  topic: FormControl<CurriculumMapFormRawValue['topic']>;
  contentStandards: FormControl<CurriculumMapFormRawValue['contentStandards']>;
  performanceStandards: FormControl<CurriculumMapFormRawValue['performanceStandards']>;
  createdBy: FormControl<CurriculumMapFormRawValue['createdBy']>;
  createdDate: FormControl<CurriculumMapFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<CurriculumMapFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<CurriculumMapFormRawValue['lastModifiedDate']>;
  course: FormControl<CurriculumMapFormRawValue['course']>;
};

export type CurriculumMapFormGroup = FormGroup<CurriculumMapFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CurriculumMapFormService {
  createCurriculumMapFormGroup(curriculumMap?: CurriculumMapFormGroupInput): CurriculumMapFormGroup {
    const curriculumMapRawValue = this.convertCurriculumMapToCurriculumMapRawValue({
      ...this.getFormDefaults(),
      ...(curriculumMap ?? { id: null }),
    });
    return new FormGroup<CurriculumMapFormGroupContent>({
      id: new FormControl(
        { value: curriculumMapRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      quarterNo: new FormControl(curriculumMapRawValue.quarterNo),
      weekNo: new FormControl(curriculumMapRawValue.weekNo),
      topic: new FormControl(curriculumMapRawValue.topic),
      contentStandards: new FormControl(curriculumMapRawValue.contentStandards),
      performanceStandards: new FormControl(curriculumMapRawValue.performanceStandards),
      createdBy: new FormControl(curriculumMapRawValue.createdBy, {
        validators: [Validators.maxLength(50)],
      }),
      createdDate: new FormControl(curriculumMapRawValue.createdDate),
      lastModifiedBy: new FormControl(curriculumMapRawValue.lastModifiedBy, {
        validators: [Validators.maxLength(50)],
      }),
      lastModifiedDate: new FormControl(curriculumMapRawValue.lastModifiedDate),
      course: new FormControl(curriculumMapRawValue.course),
    });
  }

  getCurriculumMap(form: CurriculumMapFormGroup): ICurriculumMap | NewCurriculumMap {
    return this.convertCurriculumMapRawValueToCurriculumMap(form.getRawValue());
  }

  resetForm(form: CurriculumMapFormGroup, curriculumMap: CurriculumMapFormGroupInput): void {
    const curriculumMapRawValue = this.convertCurriculumMapToCurriculumMapRawValue({ ...this.getFormDefaults(), ...curriculumMap });
    form.reset({
      ...curriculumMapRawValue,
      id: { value: curriculumMapRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): CurriculumMapFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertCurriculumMapRawValueToCurriculumMap(
    rawCurriculumMap: CurriculumMapFormRawValue | NewCurriculumMapFormRawValue,
  ): ICurriculumMap | NewCurriculumMap {
    return {
      ...rawCurriculumMap,
      createdDate: dayjs(rawCurriculumMap.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawCurriculumMap.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertCurriculumMapToCurriculumMapRawValue(
    curriculumMap: ICurriculumMap | (Partial<NewCurriculumMap> & CurriculumMapFormDefaults),
  ): CurriculumMapFormRawValue | PartialWithRequiredKeyOf<NewCurriculumMapFormRawValue> {
    return {
      ...curriculumMap,
      createdDate: curriculumMap.createdDate ? curriculumMap.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: curriculumMap.lastModifiedDate ? curriculumMap.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
