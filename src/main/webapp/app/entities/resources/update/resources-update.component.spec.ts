import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IStrategies } from 'app/entities/strategies/strategies.model';
import { StrategiesService } from 'app/entities/strategies/service/strategies.service';
import { IAssessment } from 'app/entities/assessment/assessment.model';
import { AssessmentService } from 'app/entities/assessment/service/assessment.service';
import { IResources } from '../resources.model';
import { ResourcesService } from '../service/resources.service';
import { ResourcesFormService } from './resources-form.service';

import { ResourcesUpdateComponent } from './resources-update.component';

describe('Resources Management Update Component', () => {
  let comp: ResourcesUpdateComponent;
  let fixture: ComponentFixture<ResourcesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let resourcesFormService: ResourcesFormService;
  let resourcesService: ResourcesService;
  let strategiesService: StrategiesService;
  let assessmentService: AssessmentService;

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
    strategiesService = TestBed.inject(StrategiesService);
    assessmentService = TestBed.inject(AssessmentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Strategies query and add missing value', () => {
      const resources: IResources = { id: 456 };
      const strategies: IStrategies = { id: 31647 };
      resources.strategies = strategies;

      const strategiesCollection: IStrategies[] = [{ id: 14164 }];
      jest.spyOn(strategiesService, 'query').mockReturnValue(of(new HttpResponse({ body: strategiesCollection })));
      const additionalStrategies = [strategies];
      const expectedCollection: IStrategies[] = [...additionalStrategies, ...strategiesCollection];
      jest.spyOn(strategiesService, 'addStrategiesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ resources });
      comp.ngOnInit();

      expect(strategiesService.query).toHaveBeenCalled();
      expect(strategiesService.addStrategiesToCollectionIfMissing).toHaveBeenCalledWith(
        strategiesCollection,
        ...additionalStrategies.map(expect.objectContaining),
      );
      expect(comp.strategiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Assessment query and add missing value', () => {
      const resources: IResources = { id: 456 };
      const assessment: IAssessment = { id: 28641 };
      resources.assessment = assessment;

      const assessmentCollection: IAssessment[] = [{ id: 16070 }];
      jest.spyOn(assessmentService, 'query').mockReturnValue(of(new HttpResponse({ body: assessmentCollection })));
      const additionalAssessments = [assessment];
      const expectedCollection: IAssessment[] = [...additionalAssessments, ...assessmentCollection];
      jest.spyOn(assessmentService, 'addAssessmentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ resources });
      comp.ngOnInit();

      expect(assessmentService.query).toHaveBeenCalled();
      expect(assessmentService.addAssessmentToCollectionIfMissing).toHaveBeenCalledWith(
        assessmentCollection,
        ...additionalAssessments.map(expect.objectContaining),
      );
      expect(comp.assessmentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const resources: IResources = { id: 456 };
      const strategies: IStrategies = { id: 2717 };
      resources.strategies = strategies;
      const assessment: IAssessment = { id: 21073 };
      resources.assessment = assessment;

      activatedRoute.data = of({ resources });
      comp.ngOnInit();

      expect(comp.strategiesSharedCollection).toContain(strategies);
      expect(comp.assessmentsSharedCollection).toContain(assessment);
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

  describe('Compare relationships', () => {
    describe('compareStrategies', () => {
      it('Should forward to strategiesService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(strategiesService, 'compareStrategies');
        comp.compareStrategies(entity, entity2);
        expect(strategiesService.compareStrategies).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareAssessment', () => {
      it('Should forward to assessmentService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(assessmentService, 'compareAssessment');
        comp.compareAssessment(entity, entity2);
        expect(assessmentService.compareAssessment).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
