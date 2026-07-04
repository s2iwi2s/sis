import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IAcademicYear } from 'app/entities/academic-year/academic-year.model';
import { AcademicYearService } from 'app/entities/academic-year/service/academic-year.service';
import { IAcademicTerms } from '../academic-terms.model';
import { AcademicTermsService } from '../service/academic-terms.service';

import { AcademicTermsFormService } from './academic-terms-form.service';
import { AcademicTermsUpdate } from './academic-terms-update';

describe('AcademicTerms Management Update Component', () => {
  let comp: AcademicTermsUpdate;
  let fixture: ComponentFixture<AcademicTermsUpdate>;
  let activatedRoute: ActivatedRoute;
  let academicTermsFormService: AcademicTermsFormService;
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

    fixture = TestBed.createComponent(AcademicTermsUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    academicTermsFormService = TestBed.inject(AcademicTermsFormService);
    academicTermsService = TestBed.inject(AcademicTermsService);
    academicYearService = TestBed.inject(AcademicYearService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call AcademicYear query and add missing value', () => {
      const academicTerms: IAcademicTerms = { id: 20035 };
      const year: IAcademicYear = { id: 29518 };
      academicTerms.year = year;

      const academicYearCollection: IAcademicYear[] = [{ id: 29518 }];
      vitest.spyOn(academicYearService, 'query').mockReturnValue(of(new HttpResponse({ body: academicYearCollection })));
      const additionalAcademicYears = [year];
      const expectedCollection: IAcademicYear[] = [...additionalAcademicYears, ...academicYearCollection];
      vitest.spyOn(academicYearService, 'addAcademicYearToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ academicTerms });
      comp.ngOnInit();

      expect(academicYearService.query).toHaveBeenCalled();
      expect(academicYearService.addAcademicYearToCollectionIfMissing).toHaveBeenCalledWith(
        academicYearCollection,
        ...additionalAcademicYears.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.academicYearsSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const academicTerms: IAcademicTerms = { id: 20035 };
      const year: IAcademicYear = { id: 29518 };
      academicTerms.year = year;

      activatedRoute.data = of({ academicTerms });
      comp.ngOnInit();

      expect(comp.academicYearsSharedCollection()).toContainEqual(year);
      expect(comp.academicTerms).toEqual(academicTerms);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IAcademicTerms>();
      const academicTerms = { id: 24556 };
      vitest.spyOn(academicTermsFormService, 'getAcademicTerms').mockReturnValue(academicTerms);
      vitest.spyOn(academicTermsService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ academicTerms });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(academicTerms);
      saveSubject.complete();

      // THEN
      expect(academicTermsFormService.getAcademicTerms).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(academicTermsService.update).toHaveBeenCalledWith(expect.objectContaining(academicTerms));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IAcademicTerms>();
      const academicTerms = { id: 24556 };
      vitest.spyOn(academicTermsFormService, 'getAcademicTerms').mockReturnValue({ id: null });
      vitest.spyOn(academicTermsService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ academicTerms: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(academicTerms);
      saveSubject.complete();

      // THEN
      expect(academicTermsFormService.getAcademicTerms).toHaveBeenCalled();
      expect(academicTermsService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IAcademicTerms>();
      const academicTerms = { id: 24556 };
      vitest.spyOn(academicTermsService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ academicTerms });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(academicTermsService.update).toHaveBeenCalled();
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
  });
});
