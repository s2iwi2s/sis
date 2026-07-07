import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IAcademicTerms } from 'app/entities/academic-terms/academic-terms.model';
import { AcademicTermsService } from 'app/entities/academic-terms/service/academic-terms.service';
import { IAcademicYear } from 'app/entities/academic-year/academic-year.model';
import { AcademicYearService } from 'app/entities/academic-year/service/academic-year.service';
import { IInstructor } from 'app/entities/instructor/instructor.model';
import { InstructorService } from 'app/entities/instructor/service/instructor.service';
import { StudentService } from 'app/entities/student/service/student.service';
import { IStudent } from 'app/entities/student/student.model';
import { ICourseSchedule } from '../course-schedule.model';
import { CourseScheduleService } from '../service/course-schedule.service';

import { CourseScheduleFormService } from './course-schedule-form.service';
import { CourseScheduleUpdate } from './course-schedule-update';

describe('CourseSchedule Management Update Component', () => {
  let comp: CourseScheduleUpdate;
  let fixture: ComponentFixture<CourseScheduleUpdate>;
  let activatedRoute: ActivatedRoute;
  let courseScheduleFormService: CourseScheduleFormService;
  let courseScheduleService: CourseScheduleService;
  let academicTermsService: AcademicTermsService;
  let academicYearService: AcademicYearService;
  let instructorService: InstructorService;
  let studentService: StudentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(CourseScheduleUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    courseScheduleFormService = TestBed.inject(CourseScheduleFormService);
    courseScheduleService = TestBed.inject(CourseScheduleService);
    academicTermsService = TestBed.inject(AcademicTermsService);
    academicYearService = TestBed.inject(AcademicYearService);
    instructorService = TestBed.inject(InstructorService);
    studentService = TestBed.inject(StudentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call AcademicTerms query and add missing value', () => {
      const courseSchedule: ICourseSchedule = { id: 1257 };
      const terms: IAcademicTerms = { id: 24556 };
      courseSchedule.terms = terms;

      const academicTermsCollection: IAcademicTerms[] = [{ id: 24556 }];
      vitest.spyOn(academicTermsService, 'query').mockReturnValue(of(new HttpResponse({ body: academicTermsCollection })));
      const additionalAcademicTermses = [terms];
      const expectedCollection: IAcademicTerms[] = [...additionalAcademicTermses, ...academicTermsCollection];
      vitest.spyOn(academicTermsService, 'addAcademicTermsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ courseSchedule });
      comp.ngOnInit();

      expect(academicTermsService.query).toHaveBeenCalled();
      expect(academicTermsService.addAcademicTermsToCollectionIfMissing).toHaveBeenCalledWith(
        academicTermsCollection,
        ...additionalAcademicTermses.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.academicTermsesSharedCollection()).toEqual(expectedCollection);
    });

    it('should call AcademicYear query and add missing value', () => {
      const courseSchedule: ICourseSchedule = { id: 1257 };
      const year: IAcademicYear = { id: 29518 };
      courseSchedule.year = year;

      const academicYearCollection: IAcademicYear[] = [{ id: 29518 }];
      vitest.spyOn(academicYearService, 'query').mockReturnValue(of(new HttpResponse({ body: academicYearCollection })));
      const additionalAcademicYears = [year];
      const expectedCollection: IAcademicYear[] = [...additionalAcademicYears, ...academicYearCollection];
      vitest.spyOn(academicYearService, 'addAcademicYearToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ courseSchedule });
      comp.ngOnInit();

      expect(academicYearService.query).toHaveBeenCalled();
      expect(academicYearService.addAcademicYearToCollectionIfMissing).toHaveBeenCalledWith(
        academicYearCollection,
        ...additionalAcademicYears.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.academicYearsSharedCollection()).toEqual(expectedCollection);
    });

    it('should call Instructor query and add missing value', () => {
      const courseSchedule: ICourseSchedule = { id: 1257 };
      const instructors: IInstructor[] = [{ id: 14207 }];
      courseSchedule.instructors = instructors;

      const instructorCollection: IInstructor[] = [{ id: 14207 }];
      vitest.spyOn(instructorService, 'query').mockReturnValue(of(new HttpResponse({ body: instructorCollection })));
      const additionalInstructors = [...instructors];
      const expectedCollection: IInstructor[] = [...additionalInstructors, ...instructorCollection];
      vitest.spyOn(instructorService, 'addInstructorToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ courseSchedule });
      comp.ngOnInit();

      expect(instructorService.query).toHaveBeenCalled();
      expect(instructorService.addInstructorToCollectionIfMissing).toHaveBeenCalledWith(
        instructorCollection,
        ...additionalInstructors.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.instructorsSharedCollection()).toEqual(expectedCollection);
    });

    it('should call Student query and add missing value', () => {
      const courseSchedule: ICourseSchedule = { id: 1257 };
      const students: IStudent[] = [{ id: 9978 }];
      courseSchedule.students = students;

      const studentCollection: IStudent[] = [{ id: 9978 }];
      vitest.spyOn(studentService, 'query').mockReturnValue(of(new HttpResponse({ body: studentCollection })));
      const additionalStudents = [...students];
      const expectedCollection: IStudent[] = [...additionalStudents, ...studentCollection];
      vitest.spyOn(studentService, 'addStudentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ courseSchedule });
      comp.ngOnInit();

      expect(studentService.query).toHaveBeenCalled();
      expect(studentService.addStudentToCollectionIfMissing).toHaveBeenCalledWith(
        studentCollection,
        ...additionalStudents.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.studentsSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const courseSchedule: ICourseSchedule = { id: 1257 };
      const terms: IAcademicTerms = { id: 24556 };
      courseSchedule.terms = terms;
      const year: IAcademicYear = { id: 29518 };
      courseSchedule.year = year;
      const instructor: IInstructor = { id: 14207 };
      courseSchedule.instructors = [instructor];
      const student: IStudent = { id: 9978 };
      courseSchedule.students = [student];

      activatedRoute.data = of({ courseSchedule });
      comp.ngOnInit();

      expect(comp.academicTermsesSharedCollection()).toContainEqual(terms);
      expect(comp.academicYearsSharedCollection()).toContainEqual(year);
      expect(comp.instructorsSharedCollection()).toContainEqual(instructor);
      expect(comp.studentsSharedCollection()).toContainEqual(student);
      expect(comp.courseSchedule).toEqual(courseSchedule);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<ICourseSchedule>();
      const courseSchedule = { id: 3926 };
      vitest.spyOn(courseScheduleFormService, 'getCourseSchedule').mockReturnValue(courseSchedule);
      vitest.spyOn(courseScheduleService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ courseSchedule });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(courseSchedule);
      saveSubject.complete();

      // THEN
      expect(courseScheduleFormService.getCourseSchedule).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(courseScheduleService.update).toHaveBeenCalledWith(expect.objectContaining(courseSchedule));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<ICourseSchedule>();
      const courseSchedule = { id: 3926 };
      vitest.spyOn(courseScheduleFormService, 'getCourseSchedule').mockReturnValue({ id: null });
      vitest.spyOn(courseScheduleService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ courseSchedule: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(courseSchedule);
      saveSubject.complete();

      // THEN
      expect(courseScheduleFormService.getCourseSchedule).toHaveBeenCalled();
      expect(courseScheduleService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<ICourseSchedule>();
      const courseSchedule = { id: 3926 };
      vitest.spyOn(courseScheduleService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ courseSchedule });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(courseScheduleService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAcademicTerms', () => {
      it('should forward to academicTermsService', () => {
        const entity = { id: 24556 };
        const entity2 = { id: 20035 };
        vitest.spyOn(academicTermsService, 'compareAcademicTerms');
        comp.compareAcademicTerms(entity, entity2);
        expect(academicTermsService.compareAcademicTerms).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareAcademicYear', () => {
      it('should forward to academicYearService', () => {
        const entity = { id: 29518 };
        const entity2 = { id: 7197 };
        vitest.spyOn(academicYearService, 'compareAcademicYear');
        comp.compareAcademicYear(entity, entity2);
        expect(academicYearService.compareAcademicYear).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareInstructor', () => {
      it('should forward to instructorService', () => {
        const entity = { id: 14207 };
        const entity2 = { id: 32448 };
        vitest.spyOn(instructorService, 'compareInstructor');
        comp.compareInstructor(entity, entity2);
        expect(instructorService.compareInstructor).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareStudent', () => {
      it('should forward to studentService', () => {
        const entity = { id: 9978 };
        const entity2 = { id: 22718 };
        vitest.spyOn(studentService, 'compareStudent');
        comp.compareStudent(entity, entity2);
        expect(studentService.compareStudent).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
