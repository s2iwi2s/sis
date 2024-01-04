import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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

type CurriculumMapFormDefaults = Pick<NewCurriculumMap, 'id'>;

type CurriculumMapFormGroupContent = {
  id: FormControl<ICurriculumMap['id'] | NewCurriculumMap['id']>;
  quarterNo: FormControl<ICurriculumMap['quarterNo']>;
  weekNo: FormControl<ICurriculumMap['weekNo']>;
  topic: FormControl<ICurriculumMap['topic']>;
  contentStandards: FormControl<ICurriculumMap['contentStandards']>;
  performanceStandards: FormControl<ICurriculumMap['performanceStandards']>;
  course: FormControl<ICurriculumMap['course']>;
};

export type CurriculumMapFormGroup = FormGroup<CurriculumMapFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CurriculumMapFormService {
  createCurriculumMapFormGroup(curriculumMap: CurriculumMapFormGroupInput = { id: null }): CurriculumMapFormGroup {
    const curriculumMapRawValue = {
      ...this.getFormDefaults(),
      ...curriculumMap,
    };
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
      course: new FormControl(curriculumMapRawValue.course),
    });
  }

  getCurriculumMap(form: CurriculumMapFormGroup): ICurriculumMap | NewCurriculumMap {
    return form.getRawValue() as ICurriculumMap | NewCurriculumMap;
  }

  resetForm(form: CurriculumMapFormGroup, curriculumMap: CurriculumMapFormGroupInput): void {
    const curriculumMapRawValue = { ...this.getFormDefaults(), ...curriculumMap };
    form.reset(
      {
        ...curriculumMapRawValue,
        id: { value: curriculumMapRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CurriculumMapFormDefaults {
    return {
      id: null,
    };
  }
}
