import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IAppConfig } from 'app/entities/app-config/app-config.model';
import { AppConfigService } from 'app/entities/app-config/service/app-config.service';
import { IInstructor } from 'app/entities/instructor/instructor.model';
import { InstructorService } from 'app/entities/instructor/service/instructor.service';
import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';
import { CourseService } from '../service/course.service';
import { ICourse } from '../course.model';
import { CourseFormService, CourseFormGroup } from './course-form.service';

@Component({
  standalone: true,
  selector: 'jhi-course-update',
  templateUrl: './course-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CourseUpdateComponent implements OnInit {
  isSaving = false;
  course: ICourse | null = null;

  schYrsCollection: IAppConfig[] = [];
  instructorsSharedCollection: IInstructor[] = [];
  studentsSharedCollection: IStudent[] = [];

  editForm: CourseFormGroup = this.courseFormService.createCourseFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected courseService: CourseService,
    protected courseFormService: CourseFormService,
    protected appConfigService: AppConfigService,
    protected instructorService: InstructorService,
    protected studentService: StudentService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareAppConfig = (o1: IAppConfig | null, o2: IAppConfig | null): boolean => this.appConfigService.compareAppConfig(o1, o2);

  compareInstructor = (o1: IInstructor | null, o2: IInstructor | null): boolean => this.instructorService.compareInstructor(o1, o2);

  compareStudent = (o1: IStudent | null, o2: IStudent | null): boolean => this.studentService.compareStudent(o1, o2);

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
        this.eventManager.broadcast(new EventWithContent<AlertError>('schInfoSysApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const course = this.courseFormService.getCourse(this.editForm);
    if (course.id !== null) {
      this.subscribeToSaveResponse(this.courseService.update(course));
    } else {
      this.subscribeToSaveResponse(this.courseService.create(course));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICourse>>): void {
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
    this.isSaving = false;
  }

  protected updateForm(course: ICourse): void {
    this.course = course;
    this.courseFormService.resetForm(this.editForm, course);

    this.schYrsCollection = this.appConfigService.addAppConfigToCollectionIfMissing<IAppConfig>(this.schYrsCollection, course.schYr);
    this.instructorsSharedCollection = this.instructorService.addInstructorToCollectionIfMissing<IInstructor>(
      this.instructorsSharedCollection,
      ...(course.instructors ?? []),
    );
    this.studentsSharedCollection = this.studentService.addStudentToCollectionIfMissing<IStudent>(
      this.studentsSharedCollection,
      ...(course.students ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.appConfigService
      .query({ filter: 'course-is-null' })
      .pipe(map((res: HttpResponse<IAppConfig[]>) => res.body ?? []))
      .pipe(
        map((appConfigs: IAppConfig[]) =>
          this.appConfigService.addAppConfigToCollectionIfMissing<IAppConfig>(appConfigs, this.course?.schYr),
        ),
      )
      .subscribe((appConfigs: IAppConfig[]) => (this.schYrsCollection = appConfigs));

    this.instructorService
      .query()
      .pipe(map((res: HttpResponse<IInstructor[]>) => res.body ?? []))
      .pipe(
        map((instructors: IInstructor[]) =>
          this.instructorService.addInstructorToCollectionIfMissing<IInstructor>(instructors, ...(this.course?.instructors ?? [])),
        ),
      )
      .subscribe((instructors: IInstructor[]) => (this.instructorsSharedCollection = instructors));

    this.studentService
      .query()
      .pipe(map((res: HttpResponse<IStudent[]>) => res.body ?? []))
      .pipe(
        map((students: IStudent[]) =>
          this.studentService.addStudentToCollectionIfMissing<IStudent>(students, ...(this.course?.students ?? [])),
        ),
      )
      .subscribe((students: IStudent[]) => (this.studentsSharedCollection = students));
  }
}
