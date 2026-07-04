import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IAcademicYear } from '../academic-year.model';
import { AcademicYearService } from '../service/academic-year.service';

import { AcademicYearFormService } from './academic-year-form.service';
import { AcademicYearUpdate } from './academic-year-update';

describe('AcademicYear Management Update Component', () => {
  let comp: AcademicYearUpdate;
  let fixture: ComponentFixture<AcademicYearUpdate>;
  let activatedRoute: ActivatedRoute;
  let academicYearFormService: AcademicYearFormService;
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

    fixture = TestBed.createComponent(AcademicYearUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    academicYearFormService = TestBed.inject(AcademicYearFormService);
    academicYearService = TestBed.inject(AcademicYearService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const academicYear: IAcademicYear = { id: 7197 };

      activatedRoute.data = of({ academicYear });
      comp.ngOnInit();

      expect(comp.academicYear).toEqual(academicYear);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IAcademicYear>();
      const academicYear = { id: 29518 };
      vitest.spyOn(academicYearFormService, 'getAcademicYear').mockReturnValue(academicYear);
      vitest.spyOn(academicYearService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ academicYear });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(academicYear);
      saveSubject.complete();

      // THEN
      expect(academicYearFormService.getAcademicYear).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(academicYearService.update).toHaveBeenCalledWith(expect.objectContaining(academicYear));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IAcademicYear>();
      const academicYear = { id: 29518 };
      vitest.spyOn(academicYearFormService, 'getAcademicYear').mockReturnValue({ id: null });
      vitest.spyOn(academicYearService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ academicYear: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(academicYear);
      saveSubject.complete();

      // THEN
      expect(academicYearFormService.getAcademicYear).toHaveBeenCalled();
      expect(academicYearService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IAcademicYear>();
      const academicYear = { id: 29518 };
      vitest.spyOn(academicYearService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ academicYear });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(academicYearService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
