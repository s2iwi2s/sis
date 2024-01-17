import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ResourcesService } from '../service/resources.service';
import { IResources } from '../resources.model';
import { ResourcesFormService } from './resources-form.service';

import { ResourcesUpdateComponent } from './resources-update.component';

describe('Resources Management Update Component', () => {
  let comp: ResourcesUpdateComponent;
  let fixture: ComponentFixture<ResourcesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let resourcesFormService: ResourcesFormService;
  let resourcesService: ResourcesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ResourcesUpdateComponent],
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
      .overrideTemplate(ResourcesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ResourcesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    resourcesFormService = TestBed.inject(ResourcesFormService);
    resourcesService = TestBed.inject(ResourcesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const resources: IResources = { id: 456 };

      activatedRoute.data = of({ resources });
      comp.ngOnInit();

      expect(comp.resources).toEqual(resources);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IResources>>();
      const resources = { id: 123 };
      jest.spyOn(resourcesFormService, 'getResources').mockReturnValue(resources);
      jest.spyOn(resourcesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ resources });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: resources }));
      saveSubject.complete();

      // THEN
      expect(resourcesFormService.getResources).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(resourcesService.update).toHaveBeenCalledWith(expect.objectContaining(resources));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IResources>>();
      const resources = { id: 123 };
      jest.spyOn(resourcesFormService, 'getResources').mockReturnValue({ id: null });
      jest.spyOn(resourcesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ resources: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: resources }));
      saveSubject.complete();

      // THEN
      expect(resourcesFormService.getResources).toHaveBeenCalled();
      expect(resourcesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IResources>>();
      const resources = { id: 123 };
      jest.spyOn(resourcesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ resources });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(resourcesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
