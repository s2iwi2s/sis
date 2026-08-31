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
import { IAppConfig } from 'app/entities/app-config/app-config.model';
import { AppConfigService } from 'app/entities/app-config/service/app-config.service';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { IClassSchedule } from '../class-schedule.model';
import { ClassScheduleService } from '../service/class-schedule.service';

import { ClassScheduleFormGroup, ClassScheduleFormService } from './class-schedule-form.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'jhi-class-schedule-update',
  templateUrl: './class-schedule-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class ClassScheduleUpdate implements OnInit {
  readonly isSaving = signal(false);
  classSchedule: IClassSchedule | null = null;

  gradelevelsCollection = signal<IAppConfig[]>([]);
  academicTermsesSharedCollection = signal<IAcademicTerms[]>([]);
  academicYearsSharedCollection = signal<IAcademicYear[]>([]);

  protected classScheduleService = inject(ClassScheduleService);
  protected classScheduleFormService = inject(ClassScheduleFormService);
  protected appConfigService = inject(AppConfigService);
  protected academicTermsService = inject(AcademicTermsService);
  protected academicYearService = inject(AcademicYearService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ClassScheduleFormGroup = this.classScheduleFormService.createClassScheduleFormGroup();

  compareAppConfig = (o1: IAppConfig | null, o2: IAppConfig | null): boolean => this.appConfigService.compareAppConfig(o1, o2);

  compareAcademicTerms = (o1: IAcademicTerms | null, o2: IAcademicTerms | null): boolean =>
    this.academicTermsService.compareAcademicTerms(o1, o2);

  compareAcademicYear = (o1: IAcademicYear | null, o2: IAcademicYear | null): boolean =>
    this.academicYearService.compareAcademicYear(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ classSchedule }) => {
      this.classSchedule = classSchedule;
      if (classSchedule) {
        this.updateForm(classSchedule);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const classSchedule = this.classScheduleFormService.getClassSchedule(this.editForm);
    if (classSchedule.id === null) {
      this.subscribeToSaveResponse(this.classScheduleService.create(classSchedule));
    } else {
      this.subscribeToSaveResponse(this.classScheduleService.update(classSchedule));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IClassSchedule | null>): void {
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

  protected updateForm(classSchedule: IClassSchedule): void {
    this.classSchedule = classSchedule;
    this.classScheduleFormService.resetForm(this.editForm, classSchedule);

    this.gradelevelsCollection.set(
      this.appConfigService.addAppConfigToCollectionIfMissing<IAppConfig>(this.gradelevelsCollection(), classSchedule.gradelevel),
    );
    this.academicTermsesSharedCollection.update(academicTermses =>
      this.academicTermsService.addAcademicTermsToCollectionIfMissing<IAcademicTerms>(academicTermses, classSchedule.terms),
    );
    this.academicYearsSharedCollection.update(academicYears =>
      this.academicYearService.addAcademicYearToCollectionIfMissing<IAcademicYear>(academicYears, classSchedule.year),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.appConfigService
      .query({ filter: 'classschedule-is-null' })
      .pipe(map((res: HttpResponse<IAppConfig[]>) => res.body ?? []))
      .pipe(
        map((appConfigs: IAppConfig[]) =>
          this.appConfigService.addAppConfigToCollectionIfMissing<IAppConfig>(appConfigs, this.classSchedule?.gradelevel),
        ),
      )
      .subscribe((appConfigs: IAppConfig[]) => this.gradelevelsCollection.set(appConfigs));

    this.academicTermsService
      .query()
      .pipe(map((res: HttpResponse<IAcademicTerms[]>) => res.body ?? []))
      .pipe(
        map((academicTermses: IAcademicTerms[]) =>
          this.academicTermsService.addAcademicTermsToCollectionIfMissing<IAcademicTerms>(academicTermses, this.classSchedule?.terms),
        ),
      )
      .subscribe((academicTermses: IAcademicTerms[]) => this.academicTermsesSharedCollection.set(academicTermses));

    this.academicYearService
      .query()
      .pipe(map((res: HttpResponse<IAcademicYear[]>) => res.body ?? []))
      .pipe(
        map((academicYears: IAcademicYear[]) =>
          this.academicYearService.addAcademicYearToCollectionIfMissing<IAcademicYear>(academicYears, this.classSchedule?.year),
        ),
      )
      .subscribe((academicYears: IAcademicYear[]) => this.academicYearsSharedCollection.set(academicYears));
  }
}
