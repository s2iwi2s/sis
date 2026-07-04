import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IAppConfig } from '../app-config.model';
import { AppConfigService } from '../service/app-config.service';

import { AppConfigFormService } from './app-config-form.service';
import { AppConfigUpdate } from './app-config-update';

describe('AppConfig Management Update Component', () => {
  let comp: AppConfigUpdate;
  let fixture: ComponentFixture<AppConfigUpdate>;
  let activatedRoute: ActivatedRoute;
  let appConfigFormService: AppConfigFormService;
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

    fixture = TestBed.createComponent(AppConfigUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    appConfigFormService = TestBed.inject(AppConfigFormService);
    appConfigService = TestBed.inject(AppConfigService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const appConfig: IAppConfig = { id: 7808 };

      activatedRoute.data = of({ appConfig });
      comp.ngOnInit();

      expect(comp.appConfig).toEqual(appConfig);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IAppConfig>();
      const appConfig = { id: 10896 };
      vitest.spyOn(appConfigFormService, 'getAppConfig').mockReturnValue(appConfig);
      vitest.spyOn(appConfigService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ appConfig });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(appConfig);
      saveSubject.complete();

      // THEN
      expect(appConfigFormService.getAppConfig).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(appConfigService.update).toHaveBeenCalledWith(expect.objectContaining(appConfig));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IAppConfig>();
      const appConfig = { id: 10896 };
      vitest.spyOn(appConfigFormService, 'getAppConfig').mockReturnValue({ id: null });
      vitest.spyOn(appConfigService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ appConfig: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(appConfig);
      saveSubject.complete();

      // THEN
      expect(appConfigFormService.getAppConfig).toHaveBeenCalled();
      expect(appConfigService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IAppConfig>();
      const appConfig = { id: 10896 };
      vitest.spyOn(appConfigService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ appConfig });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(appConfigService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
