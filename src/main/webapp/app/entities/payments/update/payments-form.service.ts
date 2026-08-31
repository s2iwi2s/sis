import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IPayments, NewPayments } from '../payments.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPayments for edit and NewPaymentsFormGroupInput for create.
 */
type PaymentsFormGroupInput = IPayments | PartialWithRequiredKeyOf<NewPayments>;

type PaymentsFormDefaults = Pick<NewPayments, 'id'>;

type PaymentsFormGroupContent = {
  id: FormControl<IPayments['id'] | NewPayments['id']>;
  amount: FormControl<IPayments['amount']>;
  transactionReference: FormControl<IPayments['transactionReference']>;
  createdBy: FormControl<IPayments['createdBy']>;
  createdDate: FormControl<IPayments['createdDate']>;
  lastModifiedBy: FormControl<IPayments['lastModifiedBy']>;
  lastModifiedDate: FormControl<IPayments['lastModifiedDate']>;
  method: FormControl<IPayments['method']>;
  invoices: FormControl<IPayments['invoices']>;
};

export type PaymentsFormGroup = FormGroup<PaymentsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PaymentsFormService {
  createPaymentsFormGroup(payments?: PaymentsFormGroupInput): PaymentsFormGroup {
    const paymentsRawValue = {
      ...this.getFormDefaults(),
      ...(payments ?? { id: null }),
    };
    return new FormGroup<PaymentsFormGroupContent>({
      id: new FormControl(
        { value: paymentsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      amount: new FormControl(paymentsRawValue.amount),
      transactionReference: new FormControl(paymentsRawValue.transactionReference, {
        validators: [Validators.maxLength(255)],
      }),
      createdBy: new FormControl(paymentsRawValue.createdBy, {
        validators: [Validators.maxLength(50)],
      }),
      createdDate: new FormControl(paymentsRawValue.createdDate),
      lastModifiedBy: new FormControl(paymentsRawValue.lastModifiedBy, {
        validators: [Validators.maxLength(50)],
      }),
      lastModifiedDate: new FormControl(paymentsRawValue.lastModifiedDate),
      method: new FormControl(paymentsRawValue.method),
      invoices: new FormControl(paymentsRawValue.invoices),
    });
  }

  getPayments(form: PaymentsFormGroup): IPayments | NewPayments {
    return form.getRawValue();
  }

  resetForm(form: PaymentsFormGroup, payments: PaymentsFormGroupInput): void {
    const paymentsRawValue = { ...this.getFormDefaults(), ...payments };
    form.reset({
      ...paymentsRawValue,
      id: { value: paymentsRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): PaymentsFormDefaults {
    return {
      id: null,
    };
  }
}
