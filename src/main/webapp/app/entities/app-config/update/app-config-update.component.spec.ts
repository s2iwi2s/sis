import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
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
  let userService: UserService;

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
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const appConfig: IAppConfig = { id: 456 };
      const user: IUser = { id: 15810 };
      appConfig.user = user;

      const userCollection: IUser[] = [{ id: 13364 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ appConfig });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const appConfig: IAppConfig = { id: 456 };
      const user: IUser = { id: 10387 };
      appConfig.user = user;

      activatedRoute.data = of({ appConfig });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
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

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
