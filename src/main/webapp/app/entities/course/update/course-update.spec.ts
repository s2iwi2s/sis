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
import { IAppConfig } from 'app/entities/app-config/app-config.model';
import { AppConfigService } from 'app/entities/app-config/service/app-config.service';
import { IDepartments } from 'app/entities/departments/departments.model';
import { DepartmentsService } from 'app/entities/departments/service/departments.service';
import { ICourse } from '../course.model';
import { CourseService } from '../service/course.service';

import { CourseFormService } from './course-form.service';
import { CourseUpdate } from './course-update';

describe('Course Management Update Component', () => {
  let comp: CourseUpdate;
  let fixture: ComponentFixture<CourseUpdate>;
  let activatedRoute: ActivatedRoute;
  let courseFormService: CourseFormService;
  let courseService: CourseService;
  let appConfigService: AppConfigService;
  let departmentsService: DepartmentsService;
  let academicYearService: AcademicYearService;
  let academicTermsService: AcademicTermsService;

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

    fixture = TestBed.createComponent(CourseUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    courseFormService = TestBed.inject(CourseFormService);
    courseService = TestBed.inject(CourseService);
    appConfigService = TestBed.inject(AppConfigService);
    departmentsService = TestBed.inject(DepartmentsService);
    academicYearService = TestBed.inject(AcademicYearService);
    academicTermsService = TestBed.inject(AcademicTermsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call gradelevel query and add missing value', () => {
      const course: ICourse = { id: 3722 };
      const gradelevel: IAppConfig = { id: 10896 };
      course.gradelevel = gradelevel;

      const gradelevelCollection: IAppConfig[] = [{ id: 10896 }];
      vitest.spyOn(appConfigService, 'query').mockReturnValue(of(new HttpResponse({ body: gradelevelCollection })));
      const expectedCollection: IAppConfig[] = [gradelevel, ...gradelevelCollection];
      vitest.spyOn(appConfigService, 'addAppConfigToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ course });
      comp.ngOnInit();

      expect(appConfigService.query).toHaveBeenCalled();
      expect(appConfigService.addAppConfigToCollectionIfMissing).toHaveBeenCalledWith(gradelevelCollection, gradelevel);
      expect(comp.gradelevelsCollection()).toEqual(expectedCollection);
    });

    it('should call department query and add missing value', () => {
      const course: ICourse = { id: 3722 };
      const department: IDepartments = { id: 27308 };
      course.department = department;

      const departmentCollection: IDepartments[] = [{ id: 27308 }];
      vitest.spyOn(departmentsService, 'query').mockReturnValue(of(new HttpResponse({ body: departmentCollection })));
      const expectedCollection: IDepartments[] = [department, ...departmentCollection];
      vitest.spyOn(departmentsService, 'addDepartmentsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ course });
      comp.ngOnInit();

      expect(departmentsService.query).toHaveBeenCalled();
      expect(departmentsService.addDepartmentsToCollectionIfMissing).toHaveBeenCalledWith(departmentCollection, department);
      expect(comp.departmentsCollection()).toEqual(expectedCollection);
    });

    it('should call AcademicYear query and add missing value', () => {
      const course: ICourse = { id: 3722 };
      const year: IAcademicYear = { id: 29518 };
      course.year = year;

      const academicYearCollection: IAcademicYear[] = [{ id: 29518 }];
      vitest.spyOn(academicYearService, 'query').mockReturnValue(of(new HttpResponse({ body: academicYearCollection })));
      const additionalAcademicYears = [year];
      const expectedCollection: IAcademicYear[] = [...additionalAcademicYears, ...academicYearCollection];
      vitest.spyOn(academicYearService, 'addAcademicYearToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ course });
      comp.ngOnInit();

      expect(academicYearService.query).toHaveBeenCalled();
      expect(academicYearService.addAcademicYearToCollectionIfMissing).toHaveBeenCalledWith(
        academicYearCollection,
        ...additionalAcademicYears.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.academicYearsSharedCollection()).toEqual(expectedCollection);
    });

    it('should call AcademicTerms query and add missing value', () => {
      const course: ICourse = { id: 3722 };
      const terms: IAcademicTerms = { id: 24556 };
      course.terms = terms;

      const academicTermsCollection: IAcademicTerms[] = [{ id: 24556 }];
      vitest.spyOn(academicTermsService, 'query').mockReturnValue(of(new HttpResponse({ body: academicTermsCollection })));
      const additionalAcademicTermses = [terms];
      const expectedCollection: IAcademicTerms[] = [...additionalAcademicTermses, ...academicTermsCollection];
      vitest.spyOn(academicTermsService, 'addAcademicTermsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ course });
      comp.ngOnInit();

      expect(academicTermsService.query).toHaveBeenCalled();
      expect(academicTermsService.addAcademicTermsToCollectionIfMissing).toHaveBeenCalledWith(
        academicTermsCollection,
        ...additionalAcademicTermses.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.academicTermsesSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const course: ICourse = { id: 3722 };
      const gradelevel: IAppConfig = { id: 10896 };
      course.gradelevel = gradelevel;
      const department: IDepartments = { id: 27308 };
      course.department = department;
      const year: IAcademicYear = { id: 29518 };
      course.year = year;
      const terms: IAcademicTerms = { id: 24556 };
      course.terms = terms;

      activatedRoute.data = of({ course });
      comp.ngOnInit();

      expect(comp.gradelevelsCollection()).toContainEqual(gradelevel);
      expect(comp.departmentsCollection()).toContainEqual(department);
      expect(comp.academicYearsSharedCollection()).toContainEqual(year);
      expect(comp.academicTermsesSharedCollection()).toContainEqual(terms);
      expect(comp.course).toEqual(course);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<ICourse>();
      const course = { id: 2858 };
      vitest.spyOn(courseFormService, 'getCourse').mockReturnValue(course);
      vitest.spyOn(courseService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ course });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(course);
      saveSubject.complete();

      // THEN
      expect(courseFormService.getCourse).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(courseService.update).toHaveBeenCalledWith(expect.objectContaining(course));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<ICourse>();
      const course = { id: 2858 };
      vitest.spyOn(courseFormService, 'getCourse').mockReturnValue({ id: null });
      vitest.spyOn(courseService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ course: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(course);
      saveSubject.complete();

      // THEN
      expect(courseFormService.getCourse).toHaveBeenCalled();
      expect(courseService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<ICourse>();
      const course = { id: 2858 };
      vitest.spyOn(courseService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ course });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(courseService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAppConfig', () => {
      it('should forward to appConfigService', () => {
        const entity = { id: 10896 };
        const entity2 = { id: 7808 };
        vitest.spyOn(appConfigService, 'compareAppConfig');
        comp.compareAppConfig(entity, entity2);
        expect(appConfigService.compareAppConfig).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareDepartments', () => {
      it('should forward to departmentsService', () => {
        const entity = { id: 27308 };
        const entity2 = { id: 8098 };
        vitest.spyOn(departmentsService, 'compareDepartments');
        comp.compareDepartments(entity, entity2);
        expect(departmentsService.compareDepartments).toHaveBeenCalledWith(entity, entity2);
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

    describe('compareAcademicTerms', () => {
      it('should forward to academicTermsService', () => {
        const entity = { id: 24556 };
        const entity2 = { id: 20035 };
        vitest.spyOn(academicTermsService, 'compareAcademicTerms');
        comp.compareAcademicTerms(entity, entity2);
        expect(academicTermsService.compareAcademicTerms).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
