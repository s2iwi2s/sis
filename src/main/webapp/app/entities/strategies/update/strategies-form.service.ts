import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IStrategies, NewStrategies } from '../strategies.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IStrategies for edit and NewStrategiesFormGroupInput for create.
 */
type StrategiesFormGroupInput = IStrategies | PartialWithRequiredKeyOf<NewStrategies>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IStrategies | NewStrategies> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type StrategiesFormRawValue = FormValueOf<IStrategies>;

type NewStrategiesFormRawValue = FormValueOf<NewStrategies>;

type StrategiesFormDefaults = Pick<NewStrategies, 'id' | 'createdDate' | 'lastModifiedDate' | 'resources'>;

type StrategiesFormGroupContent = {
  id: FormControl<StrategiesFormRawValue['id'] | NewStrategies['id']>;
  name: FormControl<StrategiesFormRawValue['name']>;
  description: FormControl<StrategiesFormRawValue['description']>;
  createdBy: FormControl<StrategiesFormRawValue['createdBy']>;
  createdDate: FormControl<StrategiesFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<StrategiesFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<StrategiesFormRawValue['lastModifiedDate']>;
  resources: FormControl<StrategiesFormRawValue['resources']>;
  learningCompetency: FormControl<StrategiesFormRawValue['learningCompetency']>;
};

export type StrategiesFormGroup = FormGroup<StrategiesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class StrategiesFormService {
  createStrategiesFormGroup(strategies: StrategiesFormGroupInput = { id: null }): StrategiesFormGroup {
    const strategiesRawValue = this.convertStrategiesToStrategiesRawValue({
      ...this.getFormDefaults(),
      ...strategies,
    });
    return new FormGroup<StrategiesFormGroupContent>({
      id: new FormControl(
        { value: strategiesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(strategiesRawValue.name),
      description: new FormControl(strategiesRawValue.description),
      createdBy: new FormControl(strategiesRawValue.createdBy, {
        validators: [Validators.maxLength(50)],
      }),
      createdDate: new FormControl(strategiesRawValue.createdDate),
      lastModifiedBy: new FormControl(strategiesRawValue.lastModifiedBy, {
        validators: [Validators.maxLength(50)],
      }),
      lastModifiedDate: new FormControl(strategiesRawValue.lastModifiedDate),
      resources: new FormControl(strategiesRawValue.resources ?? []),
      learningCompetency: new FormControl(strategiesRawValue.learningCompetency),
    });
  }

  getStrategies(form: StrategiesFormGroup): IStrategies | NewStrategies {
    return this.convertStrategiesRawValueToStrategies(form.getRawValue() as StrategiesFormRawValue | NewStrategiesFormRawValue);
  }

  resetForm(form: StrategiesFormGroup, strategies: StrategiesFormGroupInput): void {
    const strategiesRawValue = this.convertStrategiesToStrategiesRawValue({ ...this.getFormDefaults(), ...strategies });
    form.reset(
      {
        ...strategiesRawValue,
        id: { value: strategiesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): StrategiesFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
      resources: [],
    };
  }

  private convertStrategiesRawValueToStrategies(
    rawStrategies: StrategiesFormRawValue | NewStrategiesFormRawValue,
  ): IStrategies | NewStrategies {
    return {
      ...rawStrategies,
      createdDate: dayjs(rawStrategies.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawStrategies.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertStrategiesToStrategiesRawValue(
    strategies: IStrategies | (Partial<NewStrategies> & StrategiesFormDefaults),
  ): StrategiesFormRawValue | PartialWithRequiredKeyOf<NewStrategiesFormRawValue> {
    return {
      ...strategies,
      createdDate: strategies.createdDate ? strategies.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: strategies.lastModifiedDate ? strategies.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
      resources: strategies.resources ?? [],
    };
  }
}
