import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { ILearningCompetency } from 'app/entities/learning-competency/learning-competency.model';
import { LearningCompetencyService } from 'app/entities/learning-competency/service/learning-competency.service';
import { IResources } from 'app/entities/resources/resources.model';
import { ResourcesService } from 'app/entities/resources/service/resources.service';
import { StrategiesService } from '../service/strategies.service';
import { IStrategies } from '../strategies.model';

import { StrategiesFormService } from './strategies-form.service';
import { StrategiesUpdate } from './strategies-update';

describe('Strategies Management Update Component', () => {
  let comp: StrategiesUpdate;
  let fixture: ComponentFixture<StrategiesUpdate>;
  let activatedRoute: ActivatedRoute;
  let strategiesFormService: StrategiesFormService;
  let strategiesService: StrategiesService;
  let resourcesService: ResourcesService;
  let learningCompetencyService: LearningCompetencyService;

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

    fixture = TestBed.createComponent(StrategiesUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    strategiesFormService = TestBed.inject(StrategiesFormService);
    strategiesService = TestBed.inject(StrategiesService);
    resourcesService = TestBed.inject(ResourcesService);
    learningCompetencyService = TestBed.inject(LearningCompetencyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Resources query and add missing value', () => {
      const strategies: IStrategies = { id: 26831 };
      const resourceses: IResources[] = [{ id: 3547 }];
      strategies.resourceses = resourceses;

      const resourcesCollection: IResources[] = [{ id: 3547 }];
      vitest.spyOn(resourcesService, 'query').mockReturnValue(of(new HttpResponse({ body: resourcesCollection })));
      const additionalResourceses = [...resourceses];
      const expectedCollection: IResources[] = [...additionalResourceses, ...resourcesCollection];
      vitest.spyOn(resourcesService, 'addResourcesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ strategies });
      comp.ngOnInit();

      expect(resourcesService.query).toHaveBeenCalled();
      expect(resourcesService.addResourcesToCollectionIfMissing).toHaveBeenCalledWith(
        resourcesCollection,
        ...additionalResourceses.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.resourcesesSharedCollection()).toEqual(expectedCollection);
    });

    it('should call LearningCompetency query and add missing value', () => {
      const strategies: IStrategies = { id: 26831 };
      const learningCompetency: ILearningCompetency = { id: 10670 };
      strategies.learningCompetency = learningCompetency;

      const learningCompetencyCollection: ILearningCompetency[] = [{ id: 10670 }];
      vitest.spyOn(learningCompetencyService, 'query').mockReturnValue(of(new HttpResponse({ body: learningCompetencyCollection })));
      const additionalLearningCompetencies = [learningCompetency];
      const expectedCollection: ILearningCompetency[] = [...additionalLearningCompetencies, ...learningCompetencyCollection];
      vitest.spyOn(learningCompetencyService, 'addLearningCompetencyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ strategies });
      comp.ngOnInit();

      expect(learningCompetencyService.query).toHaveBeenCalled();
      expect(learningCompetencyService.addLearningCompetencyToCollectionIfMissing).toHaveBeenCalledWith(
        learningCompetencyCollection,
        ...additionalLearningCompetencies.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.learningCompetenciesSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const strategies: IStrategies = { id: 26831 };
      const resources: IResources = { id: 3547 };
      strategies.resourceses = [resources];
      const learningCompetency: ILearningCompetency = { id: 10670 };
      strategies.learningCompetency = learningCompetency;

      activatedRoute.data = of({ strategies });
      comp.ngOnInit();

      expect(comp.resourcesesSharedCollection()).toContainEqual(resources);
      expect(comp.learningCompetenciesSharedCollection()).toContainEqual(learningCompetency);
      expect(comp.strategies).toEqual(strategies);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IStrategies>();
      const strategies = { id: 3934 };
      vitest.spyOn(strategiesFormService, 'getStrategies').mockReturnValue(strategies);
      vitest.spyOn(strategiesService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ strategies });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(strategies);
      saveSubject.complete();

      // THEN
      expect(strategiesFormService.getStrategies).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(strategiesService.update).toHaveBeenCalledWith(expect.objectContaining(strategies));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IStrategies>();
      const strategies = { id: 3934 };
      vitest.spyOn(strategiesFormService, 'getStrategies').mockReturnValue({ id: null });
      vitest.spyOn(strategiesService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ strategies: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(strategies);
      saveSubject.complete();

      // THEN
      expect(strategiesFormService.getStrategies).toHaveBeenCalled();
      expect(strategiesService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IStrategies>();
      const strategies = { id: 3934 };
      vitest.spyOn(strategiesService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ strategies });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(strategiesService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareResources', () => {
      it('should forward to resourcesService', () => {
        const entity = { id: 3547 };
        const entity2 = { id: 4633 };
        vitest.spyOn(resourcesService, 'compareResources');
        comp.compareResources(entity, entity2);
        expect(resourcesService.compareResources).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareLearningCompetency', () => {
      it('should forward to learningCompetencyService', () => {
        const entity = { id: 10670 };
        const entity2 = { id: 20625 };
        vitest.spyOn(learningCompetencyService, 'compareLearningCompetency');
        comp.compareLearningCompetency(entity, entity2);
        expect(learningCompetencyService.compareLearningCompetency).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
