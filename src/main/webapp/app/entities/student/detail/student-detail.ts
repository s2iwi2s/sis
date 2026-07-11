import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

import { Alert } from 'app/shared/alert/alert';
import { AlertError } from 'app/shared/alert/alert-error';
import { FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { TranslateDirective } from 'app/shared/language';
import { IStudent } from '../student.model';
import { NamePipe } from '../../../shared/name/name-pipe';
import { AgePipe } from '../../../shared/age/age-pipe';
import { PartialUpdateStudent, StudentService } from '../service/student.service';
import { finalize, Observable } from 'rxjs';
import dayjs from 'dayjs/esm';
import { DATE_FORMAT } from '../../../config/input.constants';
import { ApplicationConfigService } from '../../../core/config/application-config.service';

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
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    NamePipe,
    AgePipe,
  ],
})
export class StudentDetail {
  readonly source = input<String | null>(null);
  readonly student = input<IStudent | null>(null);
  readonly updateStudent = output<IStudent | null>();
  readonly isSaving = signal(false);

  protected studentService = inject(StudentService);
  protected applicationConfigService = inject(ApplicationConfigService);
  protected router = inject(Router);

  enroll(): void {
    const currentTime = dayjs();
    const param: PartialUpdateStudent = { id: this.student()?.id || 0, enrollmentDate: dayjs(currentTime, DATE_FORMAT) };
    this.subscribeToSaveResponse(this.studentService.partialUpdate(param));
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
    }
    this.updateStudent.emit(updatedStudent);
  }

  previousState(): void {
    globalThis.history.back();
  }
}
