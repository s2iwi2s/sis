import { HttpResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap/datepicker';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, finalize, map } from 'rxjs';

import { IAppConfig } from 'app/entities/app-config/app-config.model';
import { AppConfigService } from 'app/entities/app-config/service/app-config.service';
import { IInvoices } from 'app/entities/invoices/invoices.model';
import { InvoicesService } from 'app/entities/invoices/service/invoices.service';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { IPayments } from '../payments.model';
import { PaymentsService } from '../service/payments.service';

import { PaymentsFormGroup, PaymentsFormService } from './payments-form.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'jhi-payments-update',
  templateUrl: './payments-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule, NgbInputDatepicker],
})
export class PaymentsUpdate implements OnInit {
  readonly isSaving = signal(false);
  payments: IPayments | null = null;

  methodsCollection = signal<IAppConfig[]>([]);
  invoicesesSharedCollection = signal<IInvoices[]>([]);

  protected paymentsService = inject(PaymentsService);
  protected paymentsFormService = inject(PaymentsFormService);
  protected appConfigService = inject(AppConfigService);
  protected invoicesService = inject(InvoicesService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: PaymentsFormGroup = this.paymentsFormService.createPaymentsFormGroup();

  compareAppConfig = (o1: IAppConfig | null, o2: IAppConfig | null): boolean => this.appConfigService.compareAppConfig(o1, o2);

  compareInvoices = (o1: IInvoices | null, o2: IInvoices | null): boolean => this.invoicesService.compareInvoices(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ payments }) => {
      this.payments = payments;
      if (payments) {
        this.updateForm(payments);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const payments = this.paymentsFormService.getPayments(this.editForm);
    if (payments.id === null) {
      this.subscribeToSaveResponse(this.paymentsService.create(payments));
    } else {
      this.subscribeToSaveResponse(this.paymentsService.update(payments));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IPayments | null>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving.set(false);
  }

  protected updateForm(payments: IPayments): void {
    this.payments = payments;
    this.paymentsFormService.resetForm(this.editForm, payments);

    this.methodsCollection.set(
      this.appConfigService.addAppConfigToCollectionIfMissing<IAppConfig>(this.methodsCollection(), payments.method),
    );
    this.invoicesesSharedCollection.update(invoiceses =>
      this.invoicesService.addInvoicesToCollectionIfMissing<IInvoices>(invoiceses, payments.invoices),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.appConfigService
      .query({ filter: 'payments-is-null' })
      .pipe(map((res: HttpResponse<IAppConfig[]>) => res.body ?? []))
      .pipe(
        map((appConfigs: IAppConfig[]) =>
          this.appConfigService.addAppConfigToCollectionIfMissing<IAppConfig>(appConfigs, this.payments?.method),
        ),
      )
      .subscribe((appConfigs: IAppConfig[]) => this.methodsCollection.set(appConfigs));

    this.invoicesService
      .query()
      .pipe(map((res: HttpResponse<IInvoices[]>) => res.body ?? []))
      .pipe(
        map((invoiceses: IInvoices[]) =>
          this.invoicesService.addInvoicesToCollectionIfMissing<IInvoices>(invoiceses, this.payments?.invoices),
        ),
      )
      .subscribe((invoiceses: IInvoices[]) => this.invoicesesSharedCollection.set(invoiceses));
  }
}
