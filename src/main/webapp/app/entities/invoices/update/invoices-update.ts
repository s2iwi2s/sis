import { HttpResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap/datepicker';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, finalize, map } from 'rxjs';

import { StudentService } from 'app/entities/student/service/student.service';
import { IStudent } from 'app/entities/student/student.model';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { IInvoices } from '../invoices.model';
import { InvoicesService } from '../service/invoices.service';

import { InvoicesFormGroup, InvoicesFormService } from './invoices-form.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'jhi-invoices-update',
  templateUrl: './invoices-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule, NgbInputDatepicker],
})
export class InvoicesUpdate implements OnInit {
  readonly isSaving = signal(false);
  invoices: IInvoices | null = null;

  studentsSharedCollection = signal<IStudent[]>([]);

  protected invoicesService = inject(InvoicesService);
  protected invoicesFormService = inject(InvoicesFormService);
  protected studentService = inject(StudentService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: InvoicesFormGroup = this.invoicesFormService.createInvoicesFormGroup();

  compareStudent = (o1: IStudent | null, o2: IStudent | null): boolean => this.studentService.compareStudent(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ invoices }) => {
      this.invoices = invoices;
      if (invoices) {
        this.updateForm(invoices);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const invoices = this.invoicesFormService.getInvoices(this.editForm);
    if (invoices.id === null) {
      this.subscribeToSaveResponse(this.invoicesService.create(invoices));
    } else {
      this.subscribeToSaveResponse(this.invoicesService.update(invoices));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IInvoices | null>): void {
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

  protected updateForm(invoices: IInvoices): void {
    this.invoices = invoices;
    this.invoicesFormService.resetForm(this.editForm, invoices);

    this.studentsSharedCollection.update(students =>
      this.studentService.addStudentToCollectionIfMissing<IStudent>(students, invoices.student),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.studentService
      .query()
      .pipe(map((res: HttpResponse<IStudent[]>) => res.body ?? []))
      .pipe(map((students: IStudent[]) => this.studentService.addStudentToCollectionIfMissing<IStudent>(students, this.invoices?.student)))
      .subscribe((students: IStudent[]) => this.studentsSharedCollection.set(students));
  }
}
