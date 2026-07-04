import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IDepartments, NewDepartments } from '../departments.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDepartments for edit and NewDepartmentsFormGroupInput for create.
 */
type DepartmentsFormGroupInput = IDepartments | PartialWithRequiredKeyOf<NewDepartments>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IDepartments | NewDepartments> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type DepartmentsFormRawValue = FormValueOf<IDepartments>;

type NewDepartmentsFormRawValue = FormValueOf<NewDepartments>;

type DepartmentsFormDefaults = Pick<NewDepartments, 'id' | 'createdDate' | 'lastModifiedDate'>;

type DepartmentsFormGroupContent = {
  id: FormControl<DepartmentsFormRawValue['id'] | NewDepartments['id']>;
  name: FormControl<DepartmentsFormRawValue['name']>;
  description: FormControl<DepartmentsFormRawValue['description']>;
  createdBy: FormControl<DepartmentsFormRawValue['createdBy']>;
  createdDate: FormControl<DepartmentsFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<DepartmentsFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<DepartmentsFormRawValue['lastModifiedDate']>;
};

export type DepartmentsFormGroup = FormGroup<DepartmentsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DepartmentsFormService {
  createDepartmentsFormGroup(departments?: DepartmentsFormGroupInput): DepartmentsFormGroup {
    const departmentsRawValue = this.convertDepartmentsToDepartmentsRawValue({
      ...this.getFormDefaults(),
      ...(departments ?? { id: null }),
    });
    return new FormGroup<DepartmentsFormGroupContent>({
      id: new FormControl(
        { value: departmentsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(departmentsRawValue.name, {
        validators: [Validators.maxLength(50)],
      }),
      description: new FormControl(departmentsRawValue.description, {
        validators: [Validators.maxLength(250)],
      }),
      createdBy: new FormControl(departmentsRawValue.createdBy, {
        validators: [Validators.maxLength(50)],
      }),
      createdDate: new FormControl(departmentsRawValue.createdDate),
      lastModifiedBy: new FormControl(departmentsRawValue.lastModifiedBy, {
        validators: [Validators.maxLength(50)],
      }),
      lastModifiedDate: new FormControl(departmentsRawValue.lastModifiedDate),
    });
  }

  getDepartments(form: DepartmentsFormGroup): IDepartments | NewDepartments {
    return this.convertDepartmentsRawValueToDepartments(form.getRawValue());
  }

  resetForm(form: DepartmentsFormGroup, departments: DepartmentsFormGroupInput): void {
    const departmentsRawValue = this.convertDepartmentsToDepartmentsRawValue({ ...this.getFormDefaults(), ...departments });
    form.reset({
      ...departmentsRawValue,
      id: { value: departmentsRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): DepartmentsFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertDepartmentsRawValueToDepartments(
    rawDepartments: DepartmentsFormRawValue | NewDepartmentsFormRawValue,
  ): IDepartments | NewDepartments {
    return {
      ...rawDepartments,
      createdDate: dayjs(rawDepartments.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawDepartments.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertDepartmentsToDepartmentsRawValue(
    departments: IDepartments | (Partial<NewDepartments> & DepartmentsFormDefaults),
  ): DepartmentsFormRawValue | PartialWithRequiredKeyOf<NewDepartmentsFormRawValue> {
    return {
      ...departments,
      createdDate: departments.createdDate ? departments.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: departments.lastModifiedDate ? departments.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
