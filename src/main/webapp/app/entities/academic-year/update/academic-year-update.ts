import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap/datepicker';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, finalize } from 'rxjs';

import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { IAcademicYear } from '../academic-year.model';
import { AcademicYearService } from '../service/academic-year.service';

import { AcademicYearFormGroup, AcademicYearFormService } from './academic-year-form.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'jhi-academic-year-update',
  templateUrl: './academic-year-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule, NgbInputDatepicker],
})
export class AcademicYearUpdate implements OnInit {
  readonly isSaving = signal(false);
  academicYear: IAcademicYear | null = null;

  protected academicYearService = inject(AcademicYearService);
  protected academicYearFormService = inject(AcademicYearFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: AcademicYearFormGroup = this.academicYearFormService.createAcademicYearFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ academicYear }) => {
      this.academicYear = academicYear;
      if (academicYear) {
        this.updateForm(academicYear);
      }
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const academicYear = this.academicYearFormService.getAcademicYear(this.editForm);
    if (academicYear.id === null) {
      this.subscribeToSaveResponse(this.academicYearService.create(academicYear));
    } else {
      this.subscribeToSaveResponse(this.academicYearService.update(academicYear));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IAcademicYear | null>): void {
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

  protected updateForm(academicYear: IAcademicYear): void {
    this.academicYear = academicYear;
    this.academicYearFormService.resetForm(this.editForm, academicYear);
  }
}
