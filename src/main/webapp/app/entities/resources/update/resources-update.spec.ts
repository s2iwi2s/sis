import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IAssessment } from 'app/entities/assessment/assessment.model';
import { AssessmentService } from 'app/entities/assessment/service/assessment.service';
import { StrategiesService } from 'app/entities/strategies/service/strategies.service';
import { IStrategies } from 'app/entities/strategies/strategies.model';
import { IResources } from '../resources.model';
import { ResourcesService } from '../service/resources.service';

import { ResourcesFormService } from './resources-form.service';
import { ResourcesUpdate } from './resources-update';

describe('Resources Management Update Component', () => {
  let comp: ResourcesUpdate;
  let fixture: ComponentFixture<ResourcesUpdate>;
  let activatedRoute: ActivatedRoute;
  let resourcesFormService: ResourcesFormService;
  let resourcesService: ResourcesService;
  let strategiesService: StrategiesService;
  let assessmentService: AssessmentService;

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

    fixture = TestBed.createComponent(ResourcesUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    resourcesFormService = TestBed.inject(ResourcesFormService);
    resourcesService = TestBed.inject(ResourcesService);
    strategiesService = TestBed.inject(StrategiesService);
    assessmentService = TestBed.inject(AssessmentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Strategies query and add missing value', () => {
      const resources: IResources = { id: 4633 };
      const strategieses: IStrategies[] = [{ id: 3934 }];
      resources.strategieses = strategieses;

      const strategiesCollection: IStrategies[] = [{ id: 3934 }];
      vitest.spyOn(strategiesService, 'query').mockReturnValue(of(new HttpResponse({ body: strategiesCollection })));
      const additionalStrategieses = [...strategieses];
      const expectedCollection: IStrategies[] = [...additionalStrategieses, ...strategiesCollection];
      vitest.spyOn(strategiesService, 'addStrategiesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ resources });
      comp.ngOnInit();

      expect(strategiesService.query).toHaveBeenCalled();
      expect(strategiesService.addStrategiesToCollectionIfMissing).toHaveBeenCalledWith(
        strategiesCollection,
        ...additionalStrategieses.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.strategiesesSharedCollection()).toEqual(expectedCollection);
    });

    it('should call Assessment query and add missing value', () => {
      const resources: IResources = { id: 4633 };
      const assessments: IAssessment[] = [{ id: 23530 }];
      resources.assessments = assessments;

      const assessmentCollection: IAssessment[] = [{ id: 23530 }];
      vitest.spyOn(assessmentService, 'query').mockReturnValue(of(new HttpResponse({ body: assessmentCollection })));
      const additionalAssessments = [...assessments];
      const expectedCollection: IAssessment[] = [...additionalAssessments, ...assessmentCollection];
      vitest.spyOn(assessmentService, 'addAssessmentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ resources });
      comp.ngOnInit();

      expect(assessmentService.query).toHaveBeenCalled();
      expect(assessmentService.addAssessmentToCollectionIfMissing).toHaveBeenCalledWith(
        assessmentCollection,
        ...additionalAssessments.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.assessmentsSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const resources: IResources = { id: 4633 };
      const strategies: IStrategies = { id: 3934 };
      resources.strategieses = [strategies];
      const assessment: IAssessment = { id: 23530 };
      resources.assessments = [assessment];

      activatedRoute.data = of({ resources });
      comp.ngOnInit();

      expect(comp.strategiesesSharedCollection()).toContainEqual(strategies);
      expect(comp.assessmentsSharedCollection()).toContainEqual(assessment);
      expect(comp.resources).toEqual(resources);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IResources>();
      const resources = { id: 3547 };
      vitest.spyOn(resourcesFormService, 'getResources').mockReturnValue(resources);
      vitest.spyOn(resourcesService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ resources });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(resources);
      saveSubject.complete();

      // THEN
      expect(resourcesFormService.getResources).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(resourcesService.update).toHaveBeenCalledWith(expect.objectContaining(resources));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IResources>();
      const resources = { id: 3547 };
      vitest.spyOn(resourcesFormService, 'getResources').mockReturnValue({ id: null });
      vitest.spyOn(resourcesService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ resources: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(resources);
      saveSubject.complete();

      // THEN
      expect(resourcesFormService.getResources).toHaveBeenCalled();
      expect(resourcesService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IResources>();
      const resources = { id: 3547 };
      vitest.spyOn(resourcesService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ resources });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(resourcesService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareStrategies', () => {
      it('should forward to strategiesService', () => {
        const entity = { id: 3934 };
        const entity2 = { id: 26831 };
        vitest.spyOn(strategiesService, 'compareStrategies');
        comp.compareStrategies(entity, entity2);
        expect(strategiesService.compareStrategies).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareAssessment', () => {
      it('should forward to assessmentService', () => {
        const entity = { id: 23530 };
        const entity2 = { id: 23810 };
        vitest.spyOn(assessmentService, 'compareAssessment');
        comp.compareAssessment(entity, entity2);
        expect(assessmentService.compareAssessment).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
