import { HttpResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, finalize, map } from 'rxjs';

import { IAcademicTerms } from 'app/entities/academic-terms/academic-terms.model';
import { AcademicTermsService } from 'app/entities/academic-terms/service/academic-terms.service';
import { IAcademicYear } from 'app/entities/academic-year/academic-year.model';
import { AcademicYearService } from 'app/entities/academic-year/service/academic-year.service';
import { StudentService } from 'app/entities/student/service/student.service';
import { IStudent } from 'app/entities/student/student.model';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';

import { IEnrollment } from '../enrollment.model';
import { EnrollmentService } from '../service/enrollment.service';

import { EnrollmentFormGroup, EnrollmentFormService } from './enrollment-form.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'jhi-enrollment-update',
  templateUrl: './enrollment-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class EnrollmentUpdate implements OnInit {
  readonly isSaving = signal(false);
  enrollment: IEnrollment | null = null;

  academicYearsSharedCollection = signal<IAcademicYear[]>([]);
  academicTermsesSharedCollection = signal<IAcademicTerms[]>([]);
  studentsSharedCollection = signal<IStudent[]>([]);

  protected enrollmentService = inject(EnrollmentService);
  protected enrollmentFormService = inject(EnrollmentFormService);
  protected academicYearService = inject(AcademicYearService);
  protected academicTermsService = inject(AcademicTermsService);
  protected studentService = inject(StudentService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: EnrollmentFormGroup = this.enrollmentFormService.createEnrollmentFormGroup();

  compareAcademicYear = (o1: IAcademicYear | null, o2: IAcademicYear | null): boolean =>
    this.academicYearService.compareAcademicYear(o1, o2);

  compareAcademicTerms = (o1: IAcademicTerms | null, o2: IAcademicTerms | null): boolean =>
    this.academicTermsService.compareAcademicTerms(o1, o2);

  compareStudent = (o1: IStudent | null, o2: IStudent | null): boolean => this.studentService.compareStudent(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ enrollment }) => {
      this.enrollment = enrollment;
      if (enrollment) {
        this.updateForm(enrollment);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const enrollment = this.enrollmentFormService.getEnrollment(this.editForm);
    if (enrollment.id === null) {
      this.subscribeToSaveResponse(this.enrollmentService.create(enrollment));
    } else {
      this.subscribeToSaveResponse(this.enrollmentService.update(enrollment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IEnrollment | null>): void {
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

  protected updateForm(enrollment: IEnrollment): void {
    this.enrollment = enrollment;
    this.enrollmentFormService.resetForm(this.editForm, enrollment);

    this.academicYearsSharedCollection.update(academicYears =>
      this.academicYearService.addAcademicYearToCollectionIfMissing<IAcademicYear>(academicYears, enrollment.year),
    );
    this.academicTermsesSharedCollection.update(academicTermses =>
      this.academicTermsService.addAcademicTermsToCollectionIfMissing<IAcademicTerms>(academicTermses, enrollment.terms),
    );
    this.studentsSharedCollection.update(students =>
      this.studentService.addStudentToCollectionIfMissing<IStudent>(students, enrollment.student),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.academicYearService
      .query()
      .pipe(map((res: HttpResponse<IAcademicYear[]>) => res.body ?? []))
      .pipe(
        map((academicYears: IAcademicYear[]) =>
          this.academicYearService.addAcademicYearToCollectionIfMissing<IAcademicYear>(academicYears, this.enrollment?.year),
        ),
      )
      .subscribe((academicYears: IAcademicYear[]) => this.academicYearsSharedCollection.set(academicYears));

    this.academicTermsService
      .query()
      .pipe(map((res: HttpResponse<IAcademicTerms[]>) => res.body ?? []))
      .pipe(
        map((academicTermses: IAcademicTerms[]) =>
          this.academicTermsService.addAcademicTermsToCollectionIfMissing<IAcademicTerms>(academicTermses, this.enrollment?.terms),
        ),
      )
      .subscribe((academicTermses: IAcademicTerms[]) => this.academicTermsesSharedCollection.set(academicTermses));

    this.studentService
      .query()
      .pipe(map((res: HttpResponse<IStudent[]>) => res.body ?? []))
      .pipe(
        map((students: IStudent[]) => this.studentService.addStudentToCollectionIfMissing<IStudent>(students, this.enrollment?.student)),
      )
      .subscribe((students: IStudent[]) => this.studentsSharedCollection.set(students));
  }
}
