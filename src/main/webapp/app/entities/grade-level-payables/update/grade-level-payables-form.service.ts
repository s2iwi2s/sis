import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IGradeLevelPayables, NewGradeLevelPayables } from '../grade-level-payables.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IGradeLevelPayables for edit and NewGradeLevelPayablesFormGroupInput for create.
 */
type GradeLevelPayablesFormGroupInput = IGradeLevelPayables | PartialWithRequiredKeyOf<NewGradeLevelPayables>;

type GradeLevelPayablesFormDefaults = Pick<NewGradeLevelPayables, 'id' | 'active'>;

type GradeLevelPayablesFormGroupContent = {
  id: FormControl<IGradeLevelPayables['id'] | NewGradeLevelPayables['id']>;
  active: FormControl<IGradeLevelPayables['active']>;
  gradelevel: FormControl<IGradeLevelPayables['gradelevel']>;
};

export type GradeLevelPayablesFormGroup = FormGroup<GradeLevelPayablesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class GradeLevelPayablesFormService {
  createGradeLevelPayablesFormGroup(gradeLevelPayables?: GradeLevelPayablesFormGroupInput): GradeLevelPayablesFormGroup {
    const gradeLevelPayablesRawValue = {
      ...this.getFormDefaults(),
      ...(gradeLevelPayables ?? { id: null }),
    };
    return new FormGroup<GradeLevelPayablesFormGroupContent>({
      id: new FormControl(
        { value: gradeLevelPayablesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      active: new FormControl(gradeLevelPayablesRawValue.active),
      gradelevel: new FormControl(gradeLevelPayablesRawValue.gradelevel),
    });
  }

  getGradeLevelPayables(form: GradeLevelPayablesFormGroup): IGradeLevelPayables | NewGradeLevelPayables {
    return form.getRawValue();
  }

  resetForm(form: GradeLevelPayablesFormGroup, gradeLevelPayables: GradeLevelPayablesFormGroupInput): void {
    const gradeLevelPayablesRawValue = { ...this.getFormDefaults(), ...gradeLevelPayables };
    form.reset({
      ...gradeLevelPayablesRawValue,
      id: { value: gradeLevelPayablesRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): GradeLevelPayablesFormDefaults {
    return {
      id: null,
      active: false,
    };
  }
}
