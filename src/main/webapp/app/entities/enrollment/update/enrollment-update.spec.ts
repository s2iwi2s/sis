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
import { StudentService } from 'app/entities/student/service/student.service';
import { IStudent } from 'app/entities/student/student.model';
import { IEnrollment } from '../enrollment.model';
import { EnrollmentService } from '../service/enrollment.service';

import { EnrollmentFormService } from './enrollment-form.service';
import { EnrollmentUpdate } from './enrollment-update';

describe('Enrollment Management Update Component', () => {
  let comp: EnrollmentUpdate;
  let fixture: ComponentFixture<EnrollmentUpdate>;
  let activatedRoute: ActivatedRoute;
  let enrollmentFormService: EnrollmentFormService;
  let enrollmentService: EnrollmentService;
  let academicYearService: AcademicYearService;
  let academicTermsService: AcademicTermsService;
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

    fixture = TestBed.createComponent(EnrollmentUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    enrollmentFormService = TestBed.inject(EnrollmentFormService);
    enrollmentService = TestBed.inject(EnrollmentService);
    academicYearService = TestBed.inject(AcademicYearService);
    academicTermsService = TestBed.inject(AcademicTermsService);
    studentService = TestBed.inject(StudentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call AcademicYear query and add missing value', () => {
      const enrollment: IEnrollment = { id: 1451 };
      const year: IAcademicYear = { id: 29518 };
      enrollment.year = year;

      const academicYearCollection: IAcademicYear[] = [{ id: 29518 }];
      vitest.spyOn(academicYearService, 'query').mockReturnValue(of(new HttpResponse({ body: academicYearCollection })));
      const additionalAcademicYears = [year];
      const expectedCollection: IAcademicYear[] = [...additionalAcademicYears, ...academicYearCollection];
      vitest.spyOn(academicYearService, 'addAcademicYearToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ enrollment });
      comp.ngOnInit();

      expect(academicYearService.query).toHaveBeenCalled();
      expect(academicYearService.addAcademicYearToCollectionIfMissing).toHaveBeenCalledWith(
        academicYearCollection,
        ...additionalAcademicYears.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.academicYearsSharedCollection()).toEqual(expectedCollection);
    });

    it('should call AcademicTerms query and add missing value', () => {
      const enrollment: IEnrollment = { id: 1451 };
      const terms: IAcademicTerms = { id: 24556 };
      enrollment.terms = terms;

      const academicTermsCollection: IAcademicTerms[] = [{ id: 24556 }];
      vitest.spyOn(academicTermsService, 'query').mockReturnValue(of(new HttpResponse({ body: academicTermsCollection })));
      const additionalAcademicTermses = [terms];
      const expectedCollection: IAcademicTerms[] = [...additionalAcademicTermses, ...academicTermsCollection];
      vitest.spyOn(academicTermsService, 'addAcademicTermsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ enrollment });
      comp.ngOnInit();

      expect(academicTermsService.query).toHaveBeenCalled();
      expect(academicTermsService.addAcademicTermsToCollectionIfMissing).toHaveBeenCalledWith(
        academicTermsCollection,
        ...additionalAcademicTermses.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.academicTermsesSharedCollection()).toEqual(expectedCollection);
    });

    it('should call Student query and add missing value', () => {
      const enrollment: IEnrollment = { id: 1451 };
      const student: IStudent = { id: 9978 };
      enrollment.student = student;

      const studentCollection: IStudent[] = [{ id: 9978 }];
      vitest.spyOn(studentService, 'query').mockReturnValue(of(new HttpResponse({ body: studentCollection })));
      const additionalStudents = [student];
      const expectedCollection: IStudent[] = [...additionalStudents, ...studentCollection];
      vitest.spyOn(studentService, 'addStudentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ enrollment });
      comp.ngOnInit();

      expect(studentService.query).toHaveBeenCalled();
      expect(studentService.addStudentToCollectionIfMissing).toHaveBeenCalledWith(
        studentCollection,
        ...additionalStudents.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.studentsSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const enrollment: IEnrollment = { id: 1451 };
      const year: IAcademicYear = { id: 29518 };
      enrollment.year = year;
      const terms: IAcademicTerms = { id: 24556 };
      enrollment.terms = terms;
      const student: IStudent = { id: 9978 };
      enrollment.student = student;

      activatedRoute.data = of({ enrollment });
      comp.ngOnInit();

      expect(comp.academicYearsSharedCollection()).toContainEqual(year);
      expect(comp.academicTermsesSharedCollection()).toContainEqual(terms);
      expect(comp.studentsSharedCollection()).toContainEqual(student);
      expect(comp.enrollment).toEqual(enrollment);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IEnrollment>();
      const enrollment = { id: 26529 };
      vitest.spyOn(enrollmentFormService, 'getEnrollment').mockReturnValue(enrollment);
      vitest.spyOn(enrollmentService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ enrollment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(enrollment);
      saveSubject.complete();

      // THEN
      expect(enrollmentFormService.getEnrollment).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(enrollmentService.update).toHaveBeenCalledWith(expect.objectContaining(enrollment));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IEnrollment>();
      const enrollment = { id: 26529 };
      vitest.spyOn(enrollmentFormService, 'getEnrollment').mockReturnValue({ id: null });
      vitest.spyOn(enrollmentService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ enrollment: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(enrollment);
      saveSubject.complete();

      // THEN
      expect(enrollmentFormService.getEnrollment).toHaveBeenCalled();
      expect(enrollmentService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IEnrollment>();
      const enrollment = { id: 26529 };
      vitest.spyOn(enrollmentService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ enrollment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(enrollmentService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAcademicYear', () => {
      it('should forward to academicYearService', () => {
        const entity = { id: 29518 };
        const entity2 = { id: 7197 };
        vitest.spyOn(academicYearService, 'compareAcademicYear');
        comp.compareAcademicYear(entity, entity2);
        expect(academicYearService.compareAcademicYear).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareAcademicTerms', () => {
      it('should forward to academicTermsService', () => {
        const entity = { id: 24556 };
        const entity2 = { id: 20035 };
        vitest.spyOn(academicTermsService, 'compareAcademicTerms');
        comp.compareAcademicTerms(entity, entity2);
        expect(academicTermsService.compareAcademicTerms).toHaveBeenCalledWith(entity, entity2);
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
