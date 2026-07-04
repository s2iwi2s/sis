import { HttpResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap/datepicker';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, finalize, map } from 'rxjs';

import { IAcademicYear } from 'app/entities/academic-year/academic-year.model';
import { AcademicYearService } from 'app/entities/academic-year/service/academic-year.service';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { IAcademicTerms } from '../academic-terms.model';
import { AcademicTermsService } from '../service/academic-terms.service';

import { AcademicTermsFormGroup, AcademicTermsFormService } from './academic-terms-form.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'jhi-academic-terms-update',
  templateUrl: './academic-terms-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule, NgbInputDatepicker],
})
export class AcademicTermsUpdate implements OnInit {
  readonly isSaving = signal(false);
  academicTerms: IAcademicTerms | null = null;

  academicYearsSharedCollection = signal<IAcademicYear[]>([]);

  protected academicTermsService = inject(AcademicTermsService);
  protected academicTermsFormService = inject(AcademicTermsFormService);
  protected academicYearService = inject(AcademicYearService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: AcademicTermsFormGroup = this.academicTermsFormService.createAcademicTermsFormGroup();

  compareAcademicYear = (o1: IAcademicYear | null, o2: IAcademicYear | null): boolean =>
    this.academicYearService.compareAcademicYear(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ academicTerms }) => {
      this.academicTerms = academicTerms;
      if (academicTerms) {
        this.updateForm(academicTerms);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const academicTerms = this.academicTermsFormService.getAcademicTerms(this.editForm);
    if (academicTerms.id === null) {
      this.subscribeToSaveResponse(this.academicTermsService.create(academicTerms));
    } else {
      this.subscribeToSaveResponse(this.academicTermsService.update(academicTerms));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IAcademicTerms | null>): void {
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

  protected updateForm(academicTerms: IAcademicTerms): void {
    this.academicTerms = academicTerms;
    this.academicTermsFormService.resetForm(this.editForm, academicTerms);

    this.academicYearsSharedCollection.update(academicYears =>
      this.academicYearService.addAcademicYearToCollectionIfMissing<IAcademicYear>(academicYears, academicTerms.year),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.academicYearService
      .query()
      .pipe(map((res: HttpResponse<IAcademicYear[]>) => res.body ?? []))
      .pipe(
        map((academicYears: IAcademicYear[]) =>
          this.academicYearService.addAcademicYearToCollectionIfMissing<IAcademicYear>(academicYears, this.academicTerms?.year),
        ),
      )
      .subscribe((academicYears: IAcademicYear[]) => this.academicYearsSharedCollection.set(academicYears));
  }
}
