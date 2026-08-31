import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IClassSchedule, NewClassSchedule } from '../class-schedule.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IClassSchedule for edit and NewClassScheduleFormGroupInput for create.
 */
type ClassScheduleFormGroupInput = IClassSchedule | PartialWithRequiredKeyOf<NewClassSchedule>;

type ClassScheduleFormDefaults = Pick<NewClassSchedule, 'id'>;

type ClassScheduleFormGroupContent = {
  id: FormControl<IClassSchedule['id'] | NewClassSchedule['id']>;
  name: FormControl<IClassSchedule['name']>;
  gradelevel: FormControl<IClassSchedule['gradelevel']>;
  terms: FormControl<IClassSchedule['terms']>;
  year: FormControl<IClassSchedule['year']>;
};

export type ClassScheduleFormGroup = FormGroup<ClassScheduleFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ClassScheduleFormService {
  createClassScheduleFormGroup(classSchedule?: ClassScheduleFormGroupInput): ClassScheduleFormGroup {
    const classScheduleRawValue = {
      ...this.getFormDefaults(),
      ...(classSchedule ?? { id: null }),
    };
    return new FormGroup<ClassScheduleFormGroupContent>({
      id: new FormControl(
        { value: classScheduleRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(classScheduleRawValue.name, {
        validators: [Validators.maxLength(20)],
      }),
      gradelevel: new FormControl(classScheduleRawValue.gradelevel),
      terms: new FormControl(classScheduleRawValue.terms),
      year: new FormControl(classScheduleRawValue.year),
    });
  }

  getClassSchedule(form: ClassScheduleFormGroup): IClassSchedule | NewClassSchedule {
    return form.getRawValue();
  }

  resetForm(form: ClassScheduleFormGroup, classSchedule: ClassScheduleFormGroupInput): void {
    const classScheduleRawValue = { ...this.getFormDefaults(), ...classSchedule };
    form.reset({
      ...classScheduleRawValue,
      id: { value: classScheduleRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): ClassScheduleFormDefaults {
    return {
      id: null,
    };
  }
}
