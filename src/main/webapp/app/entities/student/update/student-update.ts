import { HttpResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, finalize, map, filter } from 'rxjs';

import { IAppConfig } from 'app/entities/app-config/app-config.model';
import { AppConfigService } from 'app/entities/app-config/service/app-config.service';
import { UserService } from 'app/entities/user/service/user.service';
import { IUser } from 'app/entities/user/user.model';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { StudentService } from '../service/student.service';
import { IStudent } from '../student.model';

import { StudentFormGroup, StudentFormService } from './student-form.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'jhi-student-update',
  templateUrl: './student-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class StudentUpdate implements OnInit {
  readonly isSaving = signal(false);
  student: IStudent | null = null;

  gendersCollection = signal<IAppConfig[]>([]);
  usersSharedCollection = signal<IUser[]>([]);

  protected studentService = inject(StudentService);
  protected studentFormService = inject(StudentFormService);
  protected appConfigService = inject(AppConfigService);
  protected userService = inject(UserService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: StudentFormGroup = this.studentFormService.createStudentFormGroup();
  filterForm: StudentFormGroup = this.studentFormService.createStudentFormGroup();

  readonly formName: string;
  compareAppConfig = (o1: IAppConfig | null, o2: IAppConfig | null): boolean => this.appConfigService.compareAppConfig(o1, o2);

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  constructor() {
    this.formName = this.activatedRoute.snapshot.paramMap.get('formName') ?? '';
  }
  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ student }) => {
      this.student = student;
      if (student) {
        this.updateForm(student);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  setFilters(): void {}
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

  protected updateForm(student: IStudent): void {
    this.student = student;
    this.studentFormService.resetForm(this.editForm, student);

    this.gendersCollection.set(
      this.appConfigService.addAppConfigToCollectionIfMissing<IAppConfig>(this.gendersCollection(), student.gender),
    );
    this.usersSharedCollection.update(users => this.userService.addUserToCollectionIfMissing<IUser>(users, student.user));
  }

  protected loadRelationshipsOptions(): void {
    this.appConfigService
      .query({ filter: 'student-is-null' })
      .pipe(map((res: HttpResponse<IAppConfig[]>) => res.body ?? []))
      .pipe(
        map((appConfigs: IAppConfig[]) =>
          this.appConfigService.addAppConfigToCollectionIfMissing<IAppConfig>(appConfigs, this.student?.gender),
        ),
      )
      .subscribe((appConfigs: IAppConfig[]) => this.gendersCollection.set(appConfigs));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.student?.user)))
      .subscribe((users: IUser[]) => this.usersSharedCollection.set(users));
  }

  protected readonly filter = filter;
}
