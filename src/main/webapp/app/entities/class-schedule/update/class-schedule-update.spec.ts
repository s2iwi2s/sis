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
import { IClassSchedule } from '../class-schedule.model';
import { ClassScheduleService } from '../service/class-schedule.service';

import { ClassScheduleFormService } from './class-schedule-form.service';
import { ClassScheduleUpdate } from './class-schedule-update';

describe('ClassSchedule Management Update Component', () => {
  let comp: ClassScheduleUpdate;
  let fixture: ComponentFixture<ClassScheduleUpdate>;
  let activatedRoute: ActivatedRoute;
  let classScheduleFormService: ClassScheduleFormService;
  let classScheduleService: ClassScheduleService;
  let appConfigService: AppConfigService;
  let academicTermsService: AcademicTermsService;
  let academicYearService: AcademicYearService;

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

    fixture = TestBed.createComponent(ClassScheduleUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    classScheduleFormService = TestBed.inject(ClassScheduleFormService);
    classScheduleService = TestBed.inject(ClassScheduleService);
    appConfigService = TestBed.inject(AppConfigService);
    academicTermsService = TestBed.inject(AcademicTermsService);
    academicYearService = TestBed.inject(AcademicYearService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call gradelevel query and add missing value', () => {
      const classSchedule: IClassSchedule = { id: 8851 };
      const gradelevel: IAppConfig = { id: 10896 };
      classSchedule.gradelevel = gradelevel;

      const gradelevelCollection: IAppConfig[] = [{ id: 10896 }];
      vitest.spyOn(appConfigService, 'query').mockReturnValue(of(new HttpResponse({ body: gradelevelCollection })));
      const expectedCollection: IAppConfig[] = [gradelevel, ...gradelevelCollection];
      vitest.spyOn(appConfigService, 'addAppConfigToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ classSchedule });
      comp.ngOnInit();

      expect(appConfigService.query).toHaveBeenCalled();
      expect(appConfigService.addAppConfigToCollectionIfMissing).toHaveBeenCalledWith(gradelevelCollection, gradelevel);
      expect(comp.gradelevelsCollection()).toEqual(expectedCollection);
    });

    it('should call AcademicTerms query and add missing value', () => {
      const classSchedule: IClassSchedule = { id: 8851 };
      const terms: IAcademicTerms = { id: 24556 };
      classSchedule.terms = terms;

      const academicTermsCollection: IAcademicTerms[] = [{ id: 24556 }];
      vitest.spyOn(academicTermsService, 'query').mockReturnValue(of(new HttpResponse({ body: academicTermsCollection })));
      const additionalAcademicTermses = [terms];
      const expectedCollection: IAcademicTerms[] = [...additionalAcademicTermses, ...academicTermsCollection];
      vitest.spyOn(academicTermsService, 'addAcademicTermsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ classSchedule });
      comp.ngOnInit();

      expect(academicTermsService.query).toHaveBeenCalled();
      expect(academicTermsService.addAcademicTermsToCollectionIfMissing).toHaveBeenCalledWith(
        academicTermsCollection,
        ...additionalAcademicTermses.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.academicTermsesSharedCollection()).toEqual(expectedCollection);
    });

    it('should call AcademicYear query and add missing value', () => {
      const classSchedule: IClassSchedule = { id: 8851 };
      const year: IAcademicYear = { id: 29518 };
      classSchedule.year = year;

      const academicYearCollection: IAcademicYear[] = [{ id: 29518 }];
      vitest.spyOn(academicYearService, 'query').mockReturnValue(of(new HttpResponse({ body: academicYearCollection })));
      const additionalAcademicYears = [year];
      const expectedCollection: IAcademicYear[] = [...additionalAcademicYears, ...academicYearCollection];
      vitest.spyOn(academicYearService, 'addAcademicYearToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ classSchedule });
      comp.ngOnInit();

      expect(academicYearService.query).toHaveBeenCalled();
      expect(academicYearService.addAcademicYearToCollectionIfMissing).toHaveBeenCalledWith(
        academicYearCollection,
        ...additionalAcademicYears.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.academicYearsSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const classSchedule: IClassSchedule = { id: 8851 };
      const gradelevel: IAppConfig = { id: 10896 };
      classSchedule.gradelevel = gradelevel;
      const terms: IAcademicTerms = { id: 24556 };
      classSchedule.terms = terms;
      const year: IAcademicYear = { id: 29518 };
      classSchedule.year = year;

      activatedRoute.data = of({ classSchedule });
      comp.ngOnInit();

      expect(comp.gradelevelsCollection()).toContainEqual(gradelevel);
      expect(comp.academicTermsesSharedCollection()).toContainEqual(terms);
      expect(comp.academicYearsSharedCollection()).toContainEqual(year);
      expect(comp.classSchedule).toEqual(classSchedule);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IClassSchedule>();
      const classSchedule = { id: 13254 };
      vitest.spyOn(classScheduleFormService, 'getClassSchedule').mockReturnValue(classSchedule);
      vitest.spyOn(classScheduleService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ classSchedule });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(classSchedule);
      saveSubject.complete();

      // THEN
      expect(classScheduleFormService.getClassSchedule).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(classScheduleService.update).toHaveBeenCalledWith(expect.objectContaining(classSchedule));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IClassSchedule>();
      const classSchedule = { id: 13254 };
      vitest.spyOn(classScheduleFormService, 'getClassSchedule').mockReturnValue({ id: null });
      vitest.spyOn(classScheduleService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ classSchedule: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(classSchedule);
      saveSubject.complete();

      // THEN
      expect(classScheduleFormService.getClassSchedule).toHaveBeenCalled();
      expect(classScheduleService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IClassSchedule>();
      const classSchedule = { id: 13254 };
      vitest.spyOn(classScheduleService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ classSchedule });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(classScheduleService.update).toHaveBeenCalled();
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
  });
});
