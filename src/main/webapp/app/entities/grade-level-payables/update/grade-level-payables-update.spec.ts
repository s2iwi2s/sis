import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IAppConfig } from 'app/entities/app-config/app-config.model';
import { AppConfigService } from 'app/entities/app-config/service/app-config.service';
import { IGradeLevelPayables } from '../grade-level-payables.model';
import { GradeLevelPayablesService } from '../service/grade-level-payables.service';

import { GradeLevelPayablesFormService } from './grade-level-payables-form.service';
import { GradeLevelPayablesUpdate } from './grade-level-payables-update';

describe('GradeLevelPayables Management Update Component', () => {
  let comp: GradeLevelPayablesUpdate;
  let fixture: ComponentFixture<GradeLevelPayablesUpdate>;
  let activatedRoute: ActivatedRoute;
  let gradeLevelPayablesFormService: GradeLevelPayablesFormService;
  let gradeLevelPayablesService: GradeLevelPayablesService;
  let appConfigService: AppConfigService;

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

    fixture = TestBed.createComponent(GradeLevelPayablesUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    gradeLevelPayablesFormService = TestBed.inject(GradeLevelPayablesFormService);
    gradeLevelPayablesService = TestBed.inject(GradeLevelPayablesService);
    appConfigService = TestBed.inject(AppConfigService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call gradelevel query and add missing value', () => {
      const gradeLevelPayables: IGradeLevelPayables = { id: 27978 };
      const gradelevel: IAppConfig = { id: 10896 };
      gradeLevelPayables.gradelevel = gradelevel;

      const gradelevelCollection: IAppConfig[] = [{ id: 10896 }];
      vitest.spyOn(appConfigService, 'query').mockReturnValue(of(new HttpResponse({ body: gradelevelCollection })));
      const expectedCollection: IAppConfig[] = [gradelevel, ...gradelevelCollection];
      vitest.spyOn(appConfigService, 'addAppConfigToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ gradeLevelPayables });
      comp.ngOnInit();

      expect(appConfigService.query).toHaveBeenCalled();
      expect(appConfigService.addAppConfigToCollectionIfMissing).toHaveBeenCalledWith(gradelevelCollection, gradelevel);
      expect(comp.gradelevelsCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const gradeLevelPayables: IGradeLevelPayables = { id: 27978 };
      const gradelevel: IAppConfig = { id: 10896 };
      gradeLevelPayables.gradelevel = gradelevel;

      activatedRoute.data = of({ gradeLevelPayables });
      comp.ngOnInit();

      expect(comp.gradelevelsCollection()).toContainEqual(gradelevel);
      expect(comp.gradeLevelPayables).toEqual(gradeLevelPayables);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IGradeLevelPayables>();
      const gradeLevelPayables = { id: 14057 };
      vitest.spyOn(gradeLevelPayablesFormService, 'getGradeLevelPayables').mockReturnValue(gradeLevelPayables);
      vitest.spyOn(gradeLevelPayablesService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gradeLevelPayables });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(gradeLevelPayables);
      saveSubject.complete();

      // THEN
      expect(gradeLevelPayablesFormService.getGradeLevelPayables).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(gradeLevelPayablesService.update).toHaveBeenCalledWith(expect.objectContaining(gradeLevelPayables));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IGradeLevelPayables>();
      const gradeLevelPayables = { id: 14057 };
      vitest.spyOn(gradeLevelPayablesFormService, 'getGradeLevelPayables').mockReturnValue({ id: null });
      vitest.spyOn(gradeLevelPayablesService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gradeLevelPayables: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(gradeLevelPayables);
      saveSubject.complete();

      // THEN
      expect(gradeLevelPayablesFormService.getGradeLevelPayables).toHaveBeenCalled();
      expect(gradeLevelPayablesService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IGradeLevelPayables>();
      const gradeLevelPayables = { id: 14057 };
      vitest.spyOn(gradeLevelPayablesService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gradeLevelPayables });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(gradeLevelPayablesService.update).toHaveBeenCalled();
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
  });
});
