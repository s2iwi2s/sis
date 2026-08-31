import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IAccountPayables, NewAccountPayables } from '../account-payables.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAccountPayables for edit and NewAccountPayablesFormGroupInput for create.
 */
type AccountPayablesFormGroupInput = IAccountPayables | PartialWithRequiredKeyOf<NewAccountPayables>;

type AccountPayablesFormDefaults = Pick<NewAccountPayables, 'id' | 'active'>;

type AccountPayablesFormGroupContent = {
  id: FormControl<IAccountPayables['id'] | NewAccountPayables['id']>;
  name: FormControl<IAccountPayables['name']>;
  description: FormControl<IAccountPayables['description']>;
  amount: FormControl<IAccountPayables['amount']>;
  priority: FormControl<IAccountPayables['priority']>;
  active: FormControl<IAccountPayables['active']>;
  createdBy: FormControl<IAccountPayables['createdBy']>;
  createdDate: FormControl<IAccountPayables['createdDate']>;
  lastModifiedBy: FormControl<IAccountPayables['lastModifiedBy']>;
  lastModifiedDate: FormControl<IAccountPayables['lastModifiedDate']>;
  invoices: FormControl<IAccountPayables['invoices']>;
  gradeLevelPayables: FormControl<IAccountPayables['gradeLevelPayables']>;
};

export type AccountPayablesFormGroup = FormGroup<AccountPayablesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AccountPayablesFormService {
  createAccountPayablesFormGroup(accountPayables?: AccountPayablesFormGroupInput): AccountPayablesFormGroup {
    const accountPayablesRawValue = {
      ...this.getFormDefaults(),
      ...(accountPayables ?? { id: null }),
    };
    return new FormGroup<AccountPayablesFormGroupContent>({
      id: new FormControl(
        { value: accountPayablesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(accountPayablesRawValue.name, {
        validators: [Validators.maxLength(25)],
      }),
      description: new FormControl(accountPayablesRawValue.description, {
        validators: [Validators.maxLength(50)],
      }),
      amount: new FormControl(accountPayablesRawValue.amount),
      priority: new FormControl(accountPayablesRawValue.priority),
      active: new FormControl(accountPayablesRawValue.active),
      createdBy: new FormControl(accountPayablesRawValue.createdBy, {
        validators: [Validators.maxLength(50)],
      }),
      createdDate: new FormControl(accountPayablesRawValue.createdDate),
      lastModifiedBy: new FormControl(accountPayablesRawValue.lastModifiedBy, {
        validators: [Validators.maxLength(50)],
      }),
      lastModifiedDate: new FormControl(accountPayablesRawValue.lastModifiedDate),
      invoices: new FormControl(accountPayablesRawValue.invoices),
      gradeLevelPayables: new FormControl(accountPayablesRawValue.gradeLevelPayables),
    });
  }

  getAccountPayables(form: AccountPayablesFormGroup): IAccountPayables | NewAccountPayables {
    return form.getRawValue();
  }

  resetForm(form: AccountPayablesFormGroup, accountPayables: AccountPayablesFormGroupInput): void {
    const accountPayablesRawValue = { ...this.getFormDefaults(), ...accountPayables };
    form.reset({
      ...accountPayablesRawValue,
      id: { value: accountPayablesRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): AccountPayablesFormDefaults {
    return {
      id: null,
      active: false,
    };
  }
}
