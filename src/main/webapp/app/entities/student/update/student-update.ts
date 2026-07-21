/* eslint-disable no-console */
import { HttpResponse } from '@angular/common/http';
import dayjs from 'dayjs/esm';

import { ChangeDetectionStrategy, Component, OnInit, inject, signal, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, finalize, map } from 'rxjs';

import { IAppConfig } from 'app/entities/app-config/app-config.model';
import { AppConfigService } from 'app/entities/app-config/service/app-config.service';
import { ICourseSchedule } from 'app/entities/course-schedule/course-schedule.model';
import { CourseScheduleService } from 'app/entities/course-schedule/service/course-schedule.service';
import { UserService } from 'app/entities/user/service/user.service';
import { IUser } from 'app/entities/user/user.model';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { StudentService } from '../service/student.service';
import { IStudent } from '../student.model';

import { StudentFormGroup, StudentFormService } from './student-form.service';
import { AgePipe } from '../../../shared/age/age-pipe';
import { DATE_FORMAT } from '../../../config/input.constants';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap/alert';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'jhi-student-update',
  templateUrl: './student-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, NgbAlert, AlertError, ReactiveFormsModule, AgePipe],
})
export class StudentUpdate implements OnInit {
  readonly isSaving = signal(false);
  readonly source: string;
  student: IStudent | null = null;

  gradelevelsCollection = signal<IAppConfig[]>([]);
  gendersCollection = signal<IAppConfig[]>([]);
  usersSharedCollection = signal<IUser[]>([]);
  courseSchedulesSharedCollection = signal<ICourseSchedule[]>([]);
  parentCivilStatusCollection = signal<IAppConfig[]>([]);

  readonly successMessage = signal('');
  readonly selfClosingAlert = viewChild<NgbAlert>('selfClosingAlert');

  protected studentService = inject(StudentService);
  protected studentFormService = inject(StudentFormService);
  protected appConfigService = inject(AppConfigService);
  protected userService = inject(UserService);
  protected courseScheduleService = inject(CourseScheduleService);
  protected activatedRoute = inject(ActivatedRoute);
  protected router = inject(Router);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: StudentFormGroup = this.studentFormService.createStudentFormGroup();

  compareAppConfig = (o1: IAppConfig | null, o2: IAppConfig | null): boolean => this.appConfigService.compareAppConfig(o1, o2);

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareCourseSchedule = (o1: ICourseSchedule | null, o2: ICourseSchedule | null): boolean =>
    this.courseScheduleService.compareCourseSchedule(o1, o2);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  constructor() {
    this.source = this.activatedRoute.snapshot.paramMap.get('source') ?? '';
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ student }) => {
      console.log('StudentUpdate.ngOnInit() called with student:', student);
      this.student = student;
      if (student) {
        this.updateForm(student);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    if (this.source === 'enroll') {
      this.router.navigate(['/enrollment-form', this.student?.id]);
    } else {
      globalThis.history.back();
    }
  }

  save(): void {
    this.isSaving.set(true);
    const student = this.studentFormService.getStudent(this.editForm);
    if (student.id === null) {
      this.subscribeToSaveResponse(this.studentService.create(student));
    } else {
      this.subscribeToSaveResponse(this.studentService.update(student));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IStudent | null>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: savedStudent => this.onSaveSuccess(savedStudent),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(savedStudent: IStudent | null): void {
    const type = this.editForm.getRawValue().id === null ? 'created' : 'updated';
    //this.student = savedStudent;
    this.setMessage(`Learner ${savedStudent?.lastName}, ${savedStudent?.firstName} is ${type}`);
    this.updateForm(savedStudent ?? ({} as IStudent));
  }

  protected setMessage(msg: string): void {
    this.successMessage.set(msg);
    setTimeout(() => this.selfClosingAlert()?.close(), 5000);
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    //protected onSaveFinalize(savedStudent: IStudent | null): void {
    // this.updateForm(savedStudent ?? this.student!);

    this.isSaving.set(false);
  }

  protected updateForm(student: IStudent): void {
    this.student = student;
    this.studentFormService.resetForm(this.editForm, student);
    this.gradelevelsCollection.set(
      this.appConfigService.addAppConfigToCollectionIfMissing<IAppConfig>(this.gradelevelsCollection(), student.gradelevel),
    );
    this.gendersCollection.set(
      this.appConfigService.addAppConfigToCollectionIfMissing<IAppConfig>(this.gendersCollection(), student.gender),
    );
    this.usersSharedCollection.update(users => this.userService.addUserToCollectionIfMissing<IUser>(users, student.user));
    this.courseSchedulesSharedCollection.update(courseSchedules =>
      this.courseScheduleService.addCourseScheduleToCollectionIfMissing<ICourseSchedule>(
        courseSchedules,
        ...(student.courseSchedules ?? []),
      ),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.appConfigService
      .getConfig('GRADE_LEVEL', this.student?.gradelevel)
      .subscribe((appConfigs: IAppConfig[]) => this.gradelevelsCollection.set(appConfigs));
    this.appConfigService
      .getConfig('GENDER', this.student?.gender)
      .subscribe((appConfigs: IAppConfig[]) => this.gendersCollection.set(appConfigs));
    this.appConfigService
      .getConfig('CIVIL_STATUS', this.student?.parentCivilStatus)
      .subscribe((appConfigs: IAppConfig[]) => this.parentCivilStatusCollection.set(appConfigs));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.student?.user)))
      .subscribe((users: IUser[]) => this.usersSharedCollection.set(users));

    this.courseScheduleService
      .query()
      .pipe(map((res: HttpResponse<ICourseSchedule[]>) => res.body ?? []))
      .pipe(
        map((courseSchedules: ICourseSchedule[]) =>
          this.courseScheduleService.addCourseScheduleToCollectionIfMissing<ICourseSchedule>(
            courseSchedules,
            ...(this.student?.courseSchedules ?? []),
          ),
        ),
      )
      .subscribe((courseSchedules: ICourseSchedule[]) => this.courseSchedulesSharedCollection.set(courseSchedules));
  }

  protected getBirthDate(): dayjs.Dayjs {
    const birthDate = this.editForm.get('birthDate')?.value;
    return dayjs(birthDate, DATE_FORMAT);
  }
}
