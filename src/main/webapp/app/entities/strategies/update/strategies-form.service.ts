import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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

type StrategiesFormDefaults = Pick<NewStrategies, 'id'>;

type StrategiesFormGroupContent = {
  id: FormControl<IStrategies['id'] | NewStrategies['id']>;
  name: FormControl<IStrategies['name']>;
  description: FormControl<IStrategies['description']>;
  learningCompetency: FormControl<IStrategies['learningCompetency']>;
};

export type StrategiesFormGroup = FormGroup<StrategiesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class StrategiesFormService {
  createStrategiesFormGroup(strategies: StrategiesFormGroupInput = { id: null }): StrategiesFormGroup {
    const strategiesRawValue = {
      ...this.getFormDefaults(),
      ...strategies,
    };
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
      learningCompetency: new FormControl(strategiesRawValue.learningCompetency),
    });
  }

  getStrategies(form: StrategiesFormGroup): IStrategies | NewStrategies {
    return form.getRawValue() as IStrategies | NewStrategies;
  }

  resetForm(form: StrategiesFormGroup, strategies: StrategiesFormGroupInput): void {
    const strategiesRawValue = { ...this.getFormDefaults(), ...strategies };
    form.reset(
      {
        ...strategiesRawValue,
        id: { value: strategiesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): StrategiesFormDefaults {
    return {
      id: null,
    };
  }
}
