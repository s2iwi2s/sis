/* eslint-disable no-console */
import { ChangeDetectionStrategy, Component, inject, input, OnChanges, OnInit, output, signal, SimpleChanges } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

import { Alert } from 'app/shared/alert/alert';
import { AlertError } from 'app/shared/alert/alert-error';
import { FormatMediumDatePipe } from 'app/shared/date';
import { TranslateDirective } from 'app/shared/language';
import { IStudent } from '../student.model';
import { NamePipe } from '../../../shared/name/name-pipe';
import { AgePipe } from '../../../shared/age/age-pipe';
import { PartialUpdateStudent, StudentService } from '../service/student.service';
import { finalize, map, Observable } from 'rxjs';
import dayjs from 'dayjs/esm';
import { DATE_FORMAT } from '../../../config/input.constants';
import { ApplicationConfigService } from '../../../core/config/application-config.service';
import { ReportsService } from '../../../modules/report/reports-service';
import { IAppConfig } from '../../app-config/app-config.model';
import { AppConfigService } from '../../app-config/service/app-config.service';
import { HttpResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import HasAnyAuthorityDirective from '../../../shared/auth/has-any-authority.directive';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'jhi-student-detail',
  templateUrl: './student-detail.html',
  imports: [
    FontAwesomeModule,
    Alert,
    AlertError,
    TranslateDirective,
    TranslateModule,
    RouterLink,
    FormatMediumDatePipe,
    NamePipe,
    AgePipe,
    FormsModule,
    HasAnyAuthorityDirective,
  ],
})
export class StudentDetail implements OnInit, OnChanges {
  readonly source = input<String | null>(null);
  readonly student = input<IStudent | null>(null);
  readonly updateStudent = output<IStudent | null>();

  readonly isSaving = signal(false);
  readonly loadingPdf = signal(false);

  protected appConfigService = inject(AppConfigService);
  protected studentService = inject(StudentService);
  protected reportsService = inject(ReportsService);
  protected applicationConfigService = inject(ApplicationConfigService);
  protected router = inject(Router);

  gradelevelsCollection = signal<IAppConfig[]>([]);

  gradelevel: Pick<IAppConfig, 'id' | 'value' | 'description'> | null | undefined = { id: null } as unknown as IAppConfig;

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    console.log('StudentDetail.ngOnChanges() called with student:', JSON.stringify(changes));
    if (changes.student) {
      this.loadRelationshipsOptions();
    }
  }
  enroll(): void {
    const currentTime = dayjs();
    const param: PartialUpdateStudent = {
      id: this.student()?.id || 0,
      enrollmentDate: dayjs(currentTime, DATE_FORMAT),
      gradelevel: this.gradelevel,
    };
    this.subscribeToSaveResponse(this.studentService.partialUpdate(param));
  }

  loadRelationshipsOptions(): void {
    this.appConfigService
      .query({ code: 'GRADE_LEVEL' })
      .pipe(map((res: HttpResponse<IAppConfig[]>) => res.body ?? []))
      .pipe(map(this.appConfigService.sortAppConfig))
      .pipe(
        map((appConfigs: IAppConfig[]) =>
          this.appConfigService.addAppConfigToCollectionIfMissing<IAppConfig>(appConfigs, this.student()?.gradelevel),
        ),
      )
      .subscribe((appConfigs: IAppConfig[]) => {
        this.gradelevelsCollection.set(appConfigs);
        this.gradelevelsCollection.set(
          this.appConfigService.addAppConfigToCollectionIfMissing<IAppConfig>(this.gradelevelsCollection(), this.student()?.gradelevel),
        );
        this.gradelevelsCollection()
          .filter(f => f.id === this.student()?.gradelevel?.id)
          .map(value => (this.gradelevel = value));
      });
  }

  protected subscribeToSaveResponse(result: Observable<IStudent | null>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: savedStudent => this.onSaveSuccess(savedStudent),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveFinalize(): void {
    //protected onSaveFinalize(savedStudent: IStudent | null): void {
    // this.updateForm(savedStudent ?? this.student!);

    this.isSaving.set(false);
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveSuccess(updatedStudent: IStudent | null): void {
    console.log('StudentDetail.onSaveSuccess() called with student:', JSON.stringify(updatedStudent));

    const uStudent = this.student();
    if (uStudent) {
      uStudent.enrollmentDate = updatedStudent?.enrollmentDate;
      uStudent.gradelevel = updatedStudent?.gradelevel;
    }
    this.updateStudent.emit(updatedStudent);
  }

  protected showPdf(): void {
    this.loadingPdf.set(true);
    const student = this.student();
    if (student) {
      this.reportsService.downloadPdf(this.studentService.getRegistrationPdf(student.id)).subscribe(() => this.loadingPdf.set(false));
    }
  }

  protected previousState(): void {
    // this.router.navigate(['/student', 'enrollment-form']);
    globalThis.history.back();
  }
}
