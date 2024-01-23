import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AppConfigService } from '../service/app-config.service';
import { IAppConfig } from '../app-config.model';
import { AppConfigFormService } from './app-config-form.service';

import { AppConfigUpdateComponent } from './app-config-update.component';

describe('AppConfig Management Update Component', () => {
  let comp: AppConfigUpdateComponent;
  let fixture: ComponentFixture<AppConfigUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let appConfigFormService: AppConfigFormService;
  let appConfigService: AppConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), AppConfigUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(AppConfigUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AppConfigUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    appConfigFormService = TestBed.inject(AppConfigFormService);
    appConfigService = TestBed.inject(AppConfigService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const appConfig: IAppConfig = { id: 456 };

      activatedRoute.data = of({ appConfig });
      comp.ngOnInit();

      expect(comp.appConfig).toEqual(appConfig);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAppConfig>>();
      const appConfig = { id: 123 };
      jest.spyOn(appConfigFormService, 'getAppConfig').mockReturnValue(appConfig);
      jest.spyOn(appConfigService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ appConfig });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: appConfig }));
      saveSubject.complete();

      // THEN
      expect(appConfigFormService.getAppConfig).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(appConfigService.update).toHaveBeenCalledWith(expect.objectContaining(appConfig));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAppConfig>>();
      const appConfig = { id: 123 };
      jest.spyOn(appConfigFormService, 'getAppConfig').mockReturnValue({ id: null });
      jest.spyOn(appConfigService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ appConfig: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: appConfig }));
      saveSubject.complete();

      // THEN
      expect(appConfigFormService.getAppConfig).toHaveBeenCalled();
      expect(appConfigService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAppConfig>>();
      const appConfig = { id: 123 };
      jest.spyOn(appConfigService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ appConfig });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(appConfigService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
