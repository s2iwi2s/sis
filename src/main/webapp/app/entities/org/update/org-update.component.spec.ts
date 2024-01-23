import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IAppConfig } from 'app/entities/app-config/app-config.model';
import { AppConfigService } from 'app/entities/app-config/service/app-config.service';
import { OrgService } from '../service/org.service';
import { IOrg } from '../org.model';
import { OrgFormService } from './org-form.service';

import { OrgUpdateComponent } from './org-update.component';

describe('Org Management Update Component', () => {
  let comp: OrgUpdateComponent;
  let fixture: ComponentFixture<OrgUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let orgFormService: OrgFormService;
  let orgService: OrgService;
  let appConfigService: AppConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), OrgUpdateComponent],
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
      .overrideTemplate(OrgUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OrgUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    orgFormService = TestBed.inject(OrgFormService);
    orgService = TestBed.inject(OrgService);
    appConfigService = TestBed.inject(AppConfigService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call currSchYr query and add missing value', () => {
      const org: IOrg = { id: 456 };
      const currSchYr: IAppConfig = { id: 28299 };
      org.currSchYr = currSchYr;

      const currSchYrCollection: IAppConfig[] = [{ id: 898 }];
      jest.spyOn(appConfigService, 'query').mockReturnValue(of(new HttpResponse({ body: currSchYrCollection })));
      const expectedCollection: IAppConfig[] = [currSchYr, ...currSchYrCollection];
      jest.spyOn(appConfigService, 'addAppConfigToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ org });
      comp.ngOnInit();

      expect(appConfigService.query).toHaveBeenCalled();
      expect(appConfigService.addAppConfigToCollectionIfMissing).toHaveBeenCalledWith(currSchYrCollection, currSchYr);
      expect(comp.currSchYrsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const org: IOrg = { id: 456 };
      const currSchYr: IAppConfig = { id: 10613 };
      org.currSchYr = currSchYr;

      activatedRoute.data = of({ org });
      comp.ngOnInit();

      expect(comp.currSchYrsCollection).toContain(currSchYr);
      expect(comp.org).toEqual(org);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrg>>();
      const org = { id: 123 };
      jest.spyOn(orgFormService, 'getOrg').mockReturnValue(org);
      jest.spyOn(orgService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ org });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: org }));
      saveSubject.complete();

      // THEN
      expect(orgFormService.getOrg).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(orgService.update).toHaveBeenCalledWith(expect.objectContaining(org));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrg>>();
      const org = { id: 123 };
      jest.spyOn(orgFormService, 'getOrg').mockReturnValue({ id: null });
      jest.spyOn(orgService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ org: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: org }));
      saveSubject.complete();

      // THEN
      expect(orgFormService.getOrg).toHaveBeenCalled();
      expect(orgService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrg>>();
      const org = { id: 123 };
      jest.spyOn(orgService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ org });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(orgService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAppConfig', () => {
      it('Should forward to appConfigService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(appConfigService, 'compareAppConfig');
        comp.compareAppConfig(entity, entity2);
        expect(appConfigService.compareAppConfig).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
