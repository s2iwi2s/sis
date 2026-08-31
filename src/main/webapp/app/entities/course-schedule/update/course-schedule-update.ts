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
import { IClassSchedule } from 'app/entities/class-schedule/class-schedule.model';
import { ClassScheduleService } from 'app/entities/class-schedule/service/class-schedule.service';
import { IInstructor } from 'app/entities/instructor/instructor.model';
import { InstructorService } from 'app/entities/instructor/service/instructor.service';
import { StudentService } from 'app/entities/student/service/student.service';
import { IStudent } from 'app/entities/student/student.model';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { ICourseSchedule } from '../course-schedule.model';
import { CourseScheduleService } from '../service/course-schedule.service';

import { CourseScheduleFormGroup, CourseScheduleFormService } from './course-schedule-form.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'jhi-course-schedule-update',
  templateUrl: './course-schedule-update.html',
  imports: [TranslateDirective, TranslateModule, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class CourseScheduleUpdate implements OnInit {
  readonly isSaving = signal(false);
  courseSchedule: ICourseSchedule | null = null;

  academicTermsesSharedCollection = signal<IAcademicTerms[]>([]);
  academicYearsSharedCollection = signal<IAcademicYear[]>([]);
  classSchedulesSharedCollection = signal<IClassSchedule[]>([]);
  studentsSharedCollection = signal<IStudent[]>([]);
  instructorsSharedCollection = signal<IInstructor[]>([]);

  protected courseScheduleService = inject(CourseScheduleService);
  protected courseScheduleFormService = inject(CourseScheduleFormService);
  protected academicTermsService = inject(AcademicTermsService);
  protected academicYearService = inject(AcademicYearService);
  protected classScheduleService = inject(ClassScheduleService);
  protected studentService = inject(StudentService);
  protected instructorService = inject(InstructorService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: CourseScheduleFormGroup = this.courseScheduleFormService.createCourseScheduleFormGroup();

  compareAcademicTerms = (o1: IAcademicTerms | null, o2: IAcademicTerms | null): boolean =>
    this.academicTermsService.compareAcademicTerms(o1, o2);

  compareAcademicYear = (o1: IAcademicYear | null, o2: IAcademicYear | null): boolean =>
    this.academicYearService.compareAcademicYear(o1, o2);

  compareClassSchedule = (o1: IClassSchedule | null, o2: IClassSchedule | null): boolean =>
    this.classScheduleService.compareClassSchedule(o1, o2);

  compareStudent = (o1: IStudent | null, o2: IStudent | null): boolean => this.studentService.compareStudent(o1, o2);

  compareInstructor = (o1: IInstructor | null, o2: IInstructor | null): boolean => this.instructorService.compareInstructor(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ courseSchedule }) => {
      this.courseSchedule = courseSchedule;
      if (courseSchedule) {
        this.updateForm(courseSchedule);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const courseSchedule = this.courseScheduleFormService.getCourseSchedule(this.editForm);
    if (courseSchedule.id === null) {
      this.subscribeToSaveResponse(this.courseScheduleService.create(courseSchedule));
    } else {
      this.subscribeToSaveResponse(this.courseScheduleService.update(courseSchedule));
    }
  }

  protected subscribeToSaveResponse(result: Observable<ICourseSchedule | null>): void {
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

  protected updateForm(courseSchedule: ICourseSchedule): void {
    this.courseSchedule = courseSchedule;
    this.courseScheduleFormService.resetForm(this.editForm, courseSchedule);

    this.academicTermsesSharedCollection.update(academicTermses =>
      this.academicTermsService.addAcademicTermsToCollectionIfMissing<IAcademicTerms>(academicTermses, courseSchedule.terms),
    );
    this.academicYearsSharedCollection.update(academicYears =>
      this.academicYearService.addAcademicYearToCollectionIfMissing<IAcademicYear>(academicYears, courseSchedule.year),
    );
    this.classSchedulesSharedCollection.update(classSchedules =>
      this.classScheduleService.addClassScheduleToCollectionIfMissing<IClassSchedule>(classSchedules, courseSchedule.classSchedule),
    );
    this.studentsSharedCollection.update(students =>
      this.studentService.addStudentToCollectionIfMissing<IStudent>(students, ...(courseSchedule.students ?? [])),
    );
    this.instructorsSharedCollection.update(instructors =>
      this.instructorService.addInstructorToCollectionIfMissing<IInstructor>(instructors, ...(courseSchedule.instructors ?? [])),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.academicTermsService
      .query()
      .pipe(map((res: HttpResponse<IAcademicTerms[]>) => res.body ?? []))
      .pipe(
        map((academicTermses: IAcademicTerms[]) =>
          this.academicTermsService.addAcademicTermsToCollectionIfMissing<IAcademicTerms>(academicTermses, this.courseSchedule?.terms),
        ),
      )
      .subscribe((academicTermses: IAcademicTerms[]) => this.academicTermsesSharedCollection.set(academicTermses));

    this.academicYearService
      .query()
      .pipe(map((res: HttpResponse<IAcademicYear[]>) => res.body ?? []))
      .pipe(
        map((academicYears: IAcademicYear[]) =>
          this.academicYearService.addAcademicYearToCollectionIfMissing<IAcademicYear>(academicYears, this.courseSchedule?.year),
        ),
      )
      .subscribe((academicYears: IAcademicYear[]) => this.academicYearsSharedCollection.set(academicYears));

    this.classScheduleService
      .query()
      .pipe(map((res: HttpResponse<IClassSchedule[]>) => res.body ?? []))
      .pipe(
        map((classSchedules: IClassSchedule[]) =>
          this.classScheduleService.addClassScheduleToCollectionIfMissing<IClassSchedule>(
            classSchedules,
            this.courseSchedule?.classSchedule,
          ),
        ),
      )
      .subscribe((classSchedules: IClassSchedule[]) => this.classSchedulesSharedCollection.set(classSchedules));

    this.studentService
      .query()
      .pipe(map((res: HttpResponse<IStudent[]>) => res.body ?? []))
      .pipe(
        map((students: IStudent[]) =>
          this.studentService.addStudentToCollectionIfMissing<IStudent>(students, ...(this.courseSchedule?.students ?? [])),
        ),
      )
      .subscribe((students: IStudent[]) => this.studentsSharedCollection.set(students));

    this.instructorService
      .query()
      .pipe(map((res: HttpResponse<IInstructor[]>) => res.body ?? []))
      .pipe(
        map((instructors: IInstructor[]) =>
          this.instructorService.addInstructorToCollectionIfMissing<IInstructor>(instructors, ...(this.courseSchedule?.instructors ?? [])),
        ),
      )
      .subscribe((instructors: IInstructor[]) => this.instructorsSharedCollection.set(instructors));
  }
}
