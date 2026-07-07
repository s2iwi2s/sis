import { HttpResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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
import { IInstructor } from '../instructor.model';
import { InstructorService } from '../service/instructor.service';

import { InstructorFormGroup, InstructorFormService } from './instructor-form.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'jhi-instructor-update',
  templateUrl: './instructor-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class InstructorUpdate implements OnInit {
  readonly isSaving = signal(false);
  instructor: IInstructor | null = null;

  gendersCollection = signal<IAppConfig[]>([]);
  usersSharedCollection = signal<IUser[]>([]);
  courseSchedulesSharedCollection = signal<ICourseSchedule[]>([]);

  protected instructorService = inject(InstructorService);
  protected instructorFormService = inject(InstructorFormService);
  protected appConfigService = inject(AppConfigService);
  protected userService = inject(UserService);
  protected courseScheduleService = inject(CourseScheduleService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: InstructorFormGroup = this.instructorFormService.createInstructorFormGroup();

  compareAppConfig = (o1: IAppConfig | null, o2: IAppConfig | null): boolean => this.appConfigService.compareAppConfig(o1, o2);

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareCourseSchedule = (o1: ICourseSchedule | null, o2: ICourseSchedule | null): boolean =>
    this.courseScheduleService.compareCourseSchedule(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ instructor }) => {
      this.instructor = instructor;
      if (instructor) {
        this.updateForm(instructor);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const instructor = this.instructorFormService.getInstructor(this.editForm);
    if (instructor.id === null) {
      this.subscribeToSaveResponse(this.instructorService.create(instructor));
    } else {
      this.subscribeToSaveResponse(this.instructorService.update(instructor));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IInstructor | null>): void {
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

  protected updateForm(instructor: IInstructor): void {
    this.instructor = instructor;
    this.instructorFormService.resetForm(this.editForm, instructor);

    this.gendersCollection.set(
      this.appConfigService.addAppConfigToCollectionIfMissing<IAppConfig>(this.gendersCollection(), instructor.gender),
    );
    this.usersSharedCollection.update(users => this.userService.addUserToCollectionIfMissing<IUser>(users, instructor.user));
    this.courseSchedulesSharedCollection.update(courseSchedules =>
      this.courseScheduleService.addCourseScheduleToCollectionIfMissing<ICourseSchedule>(
        courseSchedules,
        ...(instructor.courseSchedules ?? []),
      ),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.appConfigService
      .query({ filter: 'instructor-is-null' })
      .pipe(map((res: HttpResponse<IAppConfig[]>) => res.body ?? []))
      .pipe(
        map((appConfigs: IAppConfig[]) =>
          this.appConfigService.addAppConfigToCollectionIfMissing<IAppConfig>(appConfigs, this.instructor?.gender),
        ),
      )
      .subscribe((appConfigs: IAppConfig[]) => this.gendersCollection.set(appConfigs));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.instructor?.user)))
      .subscribe((users: IUser[]) => this.usersSharedCollection.set(users));

    this.courseScheduleService
      .query()
      .pipe(map((res: HttpResponse<ICourseSchedule[]>) => res.body ?? []))
      .pipe(
        map((courseSchedules: ICourseSchedule[]) =>
          this.courseScheduleService.addCourseScheduleToCollectionIfMissing<ICourseSchedule>(
            courseSchedules,
            ...(this.instructor?.courseSchedules ?? []),
          ),
        ),
      )
      .subscribe((courseSchedules: ICourseSchedule[]) => this.courseSchedulesSharedCollection.set(courseSchedules));
  }
}
