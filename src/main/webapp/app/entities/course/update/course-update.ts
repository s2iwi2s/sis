import { HttpResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, finalize, map } from 'rxjs';

import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { IAcademicTerms } from 'app/entities/academic-terms/academic-terms.model';
import { AcademicTermsService } from 'app/entities/academic-terms/service/academic-terms.service';
import { IAcademicYear } from 'app/entities/academic-year/academic-year.model';
import { IAppConfig } from 'app/entities/app-config/app-config.model';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';

import { ICourse } from '../course.model';
import { CourseService } from '../service/course.service';

import { CourseFormGroup, CourseFormService } from './course-form.service';
import { AlertErrorModel } from 'app/shared/alert/alert-error.model';
import { AppConfigService } from 'app/entities/app-config/service/app-config.service';
import { IDepartments } from 'app/entities/departments/departments.model';
import { DepartmentsService } from 'app/entities/departments/service/departments.service';
import { AcademicYearService } from 'app/entities/academic-year/service/academic-year.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'jhi-course-update',
  templateUrl: './course-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class CourseUpdate implements OnInit {
  readonly isSaving = signal(false);
  course: ICourse | null = null;

  gradelevelsCollection = signal<IAppConfig[]>([]);
  departmentsCollection = signal<IDepartments[]>([]);
  academicYearsSharedCollection = signal<IAcademicYear[]>([]);
  academicTermsesSharedCollection = signal<IAcademicTerms[]>([]);

  protected dataUtils = inject(DataUtils);
  protected eventManager = inject(EventManager);
  protected courseService = inject(CourseService);
  protected courseFormService = inject(CourseFormService);
  protected appConfigService = inject(AppConfigService);
  protected departmentsService = inject(DepartmentsService);
  protected academicYearService = inject(AcademicYearService);
  protected academicTermsService = inject(AcademicTermsService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: CourseFormGroup = this.courseFormService.createCourseFormGroup();

  compareAppConfig = (o1: IAppConfig | null, o2: IAppConfig | null): boolean => this.appConfigService.compareAppConfig(o1, o2);

  compareDepartments = (o1: IDepartments | null, o2: IDepartments | null): boolean => this.departmentsService.compareDepartments(o1, o2);

  compareAcademicYear = (o1: IAcademicYear | null, o2: IAcademicYear | null): boolean =>
    this.academicYearService.compareAcademicYear(o1, o2);

  compareAcademicTerms = (o1: IAcademicTerms | null, o2: IAcademicTerms | null): boolean =>
    this.academicTermsService.compareAcademicTerms(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ course }) => {
      this.course = course;
      if (course) {
        this.updateForm(course);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertErrorModel>('schInfoSysApp.error', { ...err, key: `error.file.${err.key}` })),
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const course = this.courseFormService.getCourse(this.editForm);
    if (course.id === null) {
      this.subscribeToSaveResponse(this.courseService.create(course));
    } else {
      this.subscribeToSaveResponse(this.courseService.update(course));
    }
  }

  protected subscribeToSaveResponse(result: Observable<ICourse | null>): void {
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

  protected updateForm(course: ICourse): void {
    this.course = course;
    this.courseFormService.resetForm(this.editForm, course);

    this.gradelevelsCollection.set(
      this.appConfigService.addAppConfigToCollectionIfMissing<IAppConfig>(this.gradelevelsCollection(), course.gradelevel),
    );
    this.departmentsCollection.set(
      this.departmentsService.addDepartmentsToCollectionIfMissing<IDepartments>(this.departmentsCollection(), course.department),
    );
    this.academicYearsSharedCollection.update(academicYears =>
      this.academicYearService.addAcademicYearToCollectionIfMissing<IAcademicYear>(academicYears, course.year),
    );
    this.academicTermsesSharedCollection.update(academicTermses =>
      this.academicTermsService.addAcademicTermsToCollectionIfMissing<IAcademicTerms>(academicTermses, course.terms),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.appConfigService
      .query({ code: 'GRADE_LEVEL', eagerload: true })
      .pipe(map((res: HttpResponse<IAppConfig[]>) => res.body ?? []))
      .pipe(map(this.appConfigService.sortAppConfig))
      .pipe(
        map((appConfigs: IAppConfig[]) =>
          this.appConfigService.addAppConfigToCollectionIfMissing<IAppConfig>(appConfigs, this.course?.gradelevel),
        ),
      )
      .subscribe((appConfigs: IAppConfig[]) => this.gradelevelsCollection.set(appConfigs));

    this.departmentsService
      .query({ filter: 'course-is-null' })
      .pipe(map((res: HttpResponse<IDepartments[]>) => res.body ?? []))
      .pipe(
        map((departmentses: IDepartments[]) =>
          this.departmentsService.addDepartmentsToCollectionIfMissing<IDepartments>(departmentses, this.course?.department),
        ),
      )
      .subscribe((departmentses: IDepartments[]) => this.departmentsCollection.set(departmentses));

    this.academicYearService
      .query()
      .pipe(map((res: HttpResponse<IAcademicYear[]>) => res.body ?? []))
      .pipe(
        map((academicYears: IAcademicYear[]) =>
          this.academicYearService.addAcademicYearToCollectionIfMissing<IAcademicYear>(academicYears, this.course?.year),
        ),
      )
      .subscribe((academicYears: IAcademicYear[]) => this.academicYearsSharedCollection.set(academicYears));

    this.academicTermsService
      .query()
      .pipe(map((res: HttpResponse<IAcademicTerms[]>) => res.body ?? []))
      .pipe(
        map((academicTermses: IAcademicTerms[]) =>
          this.academicTermsService.addAcademicTermsToCollectionIfMissing<IAcademicTerms>(academicTermses, this.course?.terms),
        ),
      )
      .subscribe((academicTermses: IAcademicTerms[]) => this.academicTermsesSharedCollection.set(academicTermses));
  }
}
