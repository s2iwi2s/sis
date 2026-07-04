import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IAppConfig } from 'app/entities/app-config/app-config.model';
import { AppConfigService } from 'app/entities/app-config/service/app-config.service';
import { UserService } from 'app/entities/user/service/user.service';
import { IUser } from 'app/entities/user/user.model';
import { IInstructor } from '../instructor.model';
import { InstructorService } from '../service/instructor.service';

import { InstructorFormService } from './instructor-form.service';
import { InstructorUpdate } from './instructor-update';

describe('Instructor Management Update Component', () => {
  let comp: InstructorUpdate;
  let fixture: ComponentFixture<InstructorUpdate>;
  let activatedRoute: ActivatedRoute;
  let instructorFormService: InstructorFormService;
  let instructorService: InstructorService;
  let appConfigService: AppConfigService;
  let userService: UserService;

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

    fixture = TestBed.createComponent(InstructorUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    instructorFormService = TestBed.inject(InstructorFormService);
    instructorService = TestBed.inject(InstructorService);
    appConfigService = TestBed.inject(AppConfigService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call gender query and add missing value', () => {
      const instructor: IInstructor = { id: 32448 };
      const gender: IAppConfig = { id: 10896 };
      instructor.gender = gender;

      const genderCollection: IAppConfig[] = [{ id: 10896 }];
      vitest.spyOn(appConfigService, 'query').mockReturnValue(of(new HttpResponse({ body: genderCollection })));
      const expectedCollection: IAppConfig[] = [gender, ...genderCollection];
      vitest.spyOn(appConfigService, 'addAppConfigToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ instructor });
      comp.ngOnInit();

      expect(appConfigService.query).toHaveBeenCalled();
      expect(appConfigService.addAppConfigToCollectionIfMissing).toHaveBeenCalledWith(genderCollection, gender);
      expect(comp.gendersCollection()).toEqual(expectedCollection);
    });

    it('should call User query and add missing value', () => {
      const instructor: IInstructor = { id: 32448 };
      const user: IUser = { id: 3944 };
      instructor.user = user;

      const userCollection: IUser[] = [{ id: 3944 }];
      vitest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      vitest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ instructor });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.usersSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const instructor: IInstructor = { id: 32448 };
      const gender: IAppConfig = { id: 10896 };
      instructor.gender = gender;
      const user: IUser = { id: 3944 };
      instructor.user = user;

      activatedRoute.data = of({ instructor });
      comp.ngOnInit();

      expect(comp.gendersCollection()).toContainEqual(gender);
      expect(comp.usersSharedCollection()).toContainEqual(user);
      expect(comp.instructor).toEqual(instructor);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IInstructor>();
      const instructor = { id: 14207 };
      vitest.spyOn(instructorFormService, 'getInstructor').mockReturnValue(instructor);
      vitest.spyOn(instructorService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ instructor });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(instructor);
      saveSubject.complete();

      // THEN
      expect(instructorFormService.getInstructor).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(instructorService.update).toHaveBeenCalledWith(expect.objectContaining(instructor));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IInstructor>();
      const instructor = { id: 14207 };
      vitest.spyOn(instructorFormService, 'getInstructor').mockReturnValue({ id: null });
      vitest.spyOn(instructorService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ instructor: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(instructor);
      saveSubject.complete();

      // THEN
      expect(instructorFormService.getInstructor).toHaveBeenCalled();
      expect(instructorService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IInstructor>();
      const instructor = { id: 14207 };
      vitest.spyOn(instructorService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ instructor });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(instructorService.update).toHaveBeenCalled();
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

    describe('compareUser', () => {
      it('should forward to userService', () => {
        const entity = { id: 3944 };
        const entity2 = { id: 6275 };
        vitest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
