import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ILearningCompetency } from 'app/entities/learning-competency/learning-competency.model';
import { LearningCompetencyService } from 'app/entities/learning-competency/service/learning-competency.service';
import { StrategiesService } from '../service/strategies.service';
import { IStrategies } from '../strategies.model';
import { StrategiesFormService } from './strategies-form.service';

import { StrategiesUpdateComponent } from './strategies-update.component';

describe('Strategies Management Update Component', () => {
  let comp: StrategiesUpdateComponent;
  let fixture: ComponentFixture<StrategiesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let strategiesFormService: StrategiesFormService;
  let strategiesService: StrategiesService;
  let learningCompetencyService: LearningCompetencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), StrategiesUpdateComponent],
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
      .overrideTemplate(StrategiesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StrategiesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    strategiesFormService = TestBed.inject(StrategiesFormService);
    strategiesService = TestBed.inject(StrategiesService);
    learningCompetencyService = TestBed.inject(LearningCompetencyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call LearningCompetency query and add missing value', () => {
      const strategies: IStrategies = { id: 456 };
      const learningCompetency: ILearningCompetency = { id: 405 };
      strategies.learningCompetency = learningCompetency;

      const learningCompetencyCollection: ILearningCompetency[] = [{ id: 14276 }];
      jest.spyOn(learningCompetencyService, 'query').mockReturnValue(of(new HttpResponse({ body: learningCompetencyCollection })));
      const additionalLearningCompetencies = [learningCompetency];
      const expectedCollection: ILearningCompetency[] = [...additionalLearningCompetencies, ...learningCompetencyCollection];
      jest.spyOn(learningCompetencyService, 'addLearningCompetencyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ strategies });
      comp.ngOnInit();

      expect(learningCompetencyService.query).toHaveBeenCalled();
      expect(learningCompetencyService.addLearningCompetencyToCollectionIfMissing).toHaveBeenCalledWith(
        learningCompetencyCollection,
        ...additionalLearningCompetencies.map(expect.objectContaining),
      );
      expect(comp.learningCompetenciesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const strategies: IStrategies = { id: 456 };
      const learningCompetency: ILearningCompetency = { id: 31734 };
      strategies.learningCompetency = learningCompetency;

      activatedRoute.data = of({ strategies });
      comp.ngOnInit();

      expect(comp.learningCompetenciesSharedCollection).toContain(learningCompetency);
      expect(comp.strategies).toEqual(strategies);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStrategies>>();
      const strategies = { id: 123 };
      jest.spyOn(strategiesFormService, 'getStrategies').mockReturnValue(strategies);
      jest.spyOn(strategiesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ strategies });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: strategies }));
      saveSubject.complete();

      // THEN
      expect(strategiesFormService.getStrategies).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(strategiesService.update).toHaveBeenCalledWith(expect.objectContaining(strategies));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStrategies>>();
      const strategies = { id: 123 };
      jest.spyOn(strategiesFormService, 'getStrategies').mockReturnValue({ id: null });
      jest.spyOn(strategiesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ strategies: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: strategies }));
      saveSubject.complete();

      // THEN
      expect(strategiesFormService.getStrategies).toHaveBeenCalled();
      expect(strategiesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStrategies>>();
      const strategies = { id: 123 };
      jest.spyOn(strategiesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ strategies });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(strategiesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareLearningCompetency', () => {
      it('Should forward to learningCompetencyService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(learningCompetencyService, 'compareLearningCompetency');
        comp.compareLearningCompetency(entity, entity2);
        expect(learningCompetencyService.compareLearningCompetency).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
