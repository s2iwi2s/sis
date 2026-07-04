import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IDepartments } from '../departments.model';
import { DepartmentsService } from '../service/departments.service';

import { DepartmentsFormService } from './departments-form.service';
import { DepartmentsUpdate } from './departments-update';

describe('Departments Management Update Component', () => {
  let comp: DepartmentsUpdate;
  let fixture: ComponentFixture<DepartmentsUpdate>;
  let activatedRoute: ActivatedRoute;
  let departmentsFormService: DepartmentsFormService;
  let departmentsService: DepartmentsService;

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

    fixture = TestBed.createComponent(DepartmentsUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    departmentsFormService = TestBed.inject(DepartmentsFormService);
    departmentsService = TestBed.inject(DepartmentsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const departments: IDepartments = { id: 8098 };

      activatedRoute.data = of({ departments });
      comp.ngOnInit();

      expect(comp.departments).toEqual(departments);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IDepartments>();
      const departments = { id: 27308 };
      vitest.spyOn(departmentsFormService, 'getDepartments').mockReturnValue(departments);
      vitest.spyOn(departmentsService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ departments });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(departments);
      saveSubject.complete();

      // THEN
      expect(departmentsFormService.getDepartments).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(departmentsService.update).toHaveBeenCalledWith(expect.objectContaining(departments));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IDepartments>();
      const departments = { id: 27308 };
      vitest.spyOn(departmentsFormService, 'getDepartments').mockReturnValue({ id: null });
      vitest.spyOn(departmentsService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ departments: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(departments);
      saveSubject.complete();

      // THEN
      expect(departmentsFormService.getDepartments).toHaveBeenCalled();
      expect(departmentsService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IDepartments>();
      const departments = { id: 27308 };
      vitest.spyOn(departmentsService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ departments });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(departmentsService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
