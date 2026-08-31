import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IInvoices, NewInvoices } from '../invoices.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IInvoices for edit and NewInvoicesFormGroupInput for create.
 */
type InvoicesFormGroupInput = IInvoices | PartialWithRequiredKeyOf<NewInvoices>;

type InvoicesFormDefaults = Pick<NewInvoices, 'id'>;

type InvoicesFormGroupContent = {
  id: FormControl<IInvoices['id'] | NewInvoices['id']>;
  dueDate: FormControl<IInvoices['dueDate']>;
  amountPaid: FormControl<IInvoices['amountPaid']>;
  status: FormControl<IInvoices['status']>;
  createdBy: FormControl<IInvoices['createdBy']>;
  createdDate: FormControl<IInvoices['createdDate']>;
  lastModifiedBy: FormControl<IInvoices['lastModifiedBy']>;
  lastModifiedDate: FormControl<IInvoices['lastModifiedDate']>;
  student: FormControl<IInvoices['student']>;
};

export type InvoicesFormGroup = FormGroup<InvoicesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class InvoicesFormService {
  createInvoicesFormGroup(invoices?: InvoicesFormGroupInput): InvoicesFormGroup {
    const invoicesRawValue = {
      ...this.getFormDefaults(),
      ...(invoices ?? { id: null }),
    };
    return new FormGroup<InvoicesFormGroupContent>({
      id: new FormControl(
        { value: invoicesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      dueDate: new FormControl(invoicesRawValue.dueDate),
      amountPaid: new FormControl(invoicesRawValue.amountPaid),
      status: new FormControl(invoicesRawValue.status, {
        validators: [Validators.maxLength(10)],
      }),
      createdBy: new FormControl(invoicesRawValue.createdBy, {
        validators: [Validators.maxLength(50)],
      }),
      createdDate: new FormControl(invoicesRawValue.createdDate),
      lastModifiedBy: new FormControl(invoicesRawValue.lastModifiedBy, {
        validators: [Validators.maxLength(50)],
      }),
      lastModifiedDate: new FormControl(invoicesRawValue.lastModifiedDate),
      student: new FormControl(invoicesRawValue.student),
    });
  }

  getInvoices(form: InvoicesFormGroup): IInvoices | NewInvoices {
    return form.getRawValue();
  }

  resetForm(form: InvoicesFormGroup, invoices: InvoicesFormGroupInput): void {
    const invoicesRawValue = { ...this.getFormDefaults(), ...invoices };
    form.reset({
      ...invoicesRawValue,
      id: { value: invoicesRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): InvoicesFormDefaults {
    return {
      id: null,
    };
  }
}
