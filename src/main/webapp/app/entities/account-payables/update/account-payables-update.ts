import { HttpResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap/datepicker';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, finalize, map } from 'rxjs';

import { IGradeLevelPayables } from 'app/entities/grade-level-payables/grade-level-payables.model';
import { GradeLevelPayablesService } from 'app/entities/grade-level-payables/service/grade-level-payables.service';
import { IInvoices } from 'app/entities/invoices/invoices.model';
import { InvoicesService } from 'app/entities/invoices/service/invoices.service';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { IAccountPayables } from '../account-payables.model';
import { AccountPayablesService } from '../service/account-payables.service';

import { AccountPayablesFormGroup, AccountPayablesFormService } from './account-payables-form.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'jhi-account-payables-update',
  templateUrl: './account-payables-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule, NgbInputDatepicker],
})
export class AccountPayablesUpdate implements OnInit {
  readonly isSaving = signal(false);
  accountPayables: IAccountPayables | null = null;

  invoicesesSharedCollection = signal<IInvoices[]>([]);
  gradeLevelPayablesesSharedCollection = signal<IGradeLevelPayables[]>([]);

  protected accountPayablesService = inject(AccountPayablesService);
  protected accountPayablesFormService = inject(AccountPayablesFormService);
  protected invoicesService = inject(InvoicesService);
  protected gradeLevelPayablesService = inject(GradeLevelPayablesService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: AccountPayablesFormGroup = this.accountPayablesFormService.createAccountPayablesFormGroup();

  compareInvoices = (o1: IInvoices | null, o2: IInvoices | null): boolean => this.invoicesService.compareInvoices(o1, o2);

  compareGradeLevelPayables = (o1: IGradeLevelPayables | null, o2: IGradeLevelPayables | null): boolean =>
    this.gradeLevelPayablesService.compareGradeLevelPayables(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ accountPayables }) => {
      this.accountPayables = accountPayables;
      if (accountPayables) {
        this.updateForm(accountPayables);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const accountPayables = this.accountPayablesFormService.getAccountPayables(this.editForm);
    if (accountPayables.id === null) {
      this.subscribeToSaveResponse(this.accountPayablesService.create(accountPayables));
    } else {
      this.subscribeToSaveResponse(this.accountPayablesService.update(accountPayables));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IAccountPayables | null>): void {
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

  protected updateForm(accountPayables: IAccountPayables): void {
    this.accountPayables = accountPayables;
    this.accountPayablesFormService.resetForm(this.editForm, accountPayables);

    this.invoicesesSharedCollection.update(invoiceses =>
      this.invoicesService.addInvoicesToCollectionIfMissing<IInvoices>(invoiceses, accountPayables.invoices),
    );
    this.gradeLevelPayablesesSharedCollection.update(gradeLevelPayableses =>
      this.gradeLevelPayablesService.addGradeLevelPayablesToCollectionIfMissing<IGradeLevelPayables>(
        gradeLevelPayableses,
        accountPayables.gradeLevelPayables,
      ),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.invoicesService
      .query()
      .pipe(map((res: HttpResponse<IInvoices[]>) => res.body ?? []))
      .pipe(
        map((invoiceses: IInvoices[]) =>
          this.invoicesService.addInvoicesToCollectionIfMissing<IInvoices>(invoiceses, this.accountPayables?.invoices),
        ),
      )
      .subscribe((invoiceses: IInvoices[]) => this.invoicesesSharedCollection.set(invoiceses));

    this.gradeLevelPayablesService
      .query()
      .pipe(map((res: HttpResponse<IGradeLevelPayables[]>) => res.body ?? []))
      .pipe(
        map((gradeLevelPayableses: IGradeLevelPayables[]) =>
          this.gradeLevelPayablesService.addGradeLevelPayablesToCollectionIfMissing<IGradeLevelPayables>(
            gradeLevelPayableses,
            this.accountPayables?.gradeLevelPayables,
          ),
        ),
      )
      .subscribe((gradeLevelPayableses: IGradeLevelPayables[]) => this.gradeLevelPayablesesSharedCollection.set(gradeLevelPayableses));
  }
}
