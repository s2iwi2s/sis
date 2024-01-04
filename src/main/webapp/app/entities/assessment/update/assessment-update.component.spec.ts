import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ILearningCompetency } from 'app/entities/learning-competency/learning-competency.model';
import { LearningCompetencyService } from 'app/entities/learning-competency/service/learning-competency.service';
import { AssessmentService } from '../service/assessment.service';
import { IAssessment } from '../assessment.model';
import { AssessmentFormService } from './assessment-form.service';

import { AssessmentUpdateComponent } from './assessment-update.component';

describe('Assessment Management Update Component', () => {
  let comp: AssessmentUpdateComponent;
  let fixture: ComponentFixture<AssessmentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let assessmentFormService: AssessmentFormService;
  let assessmentService: AssessmentService;
  let learningCompetencyService: LearningCompetencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), AssessmentUpdateComponent],
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
      .overrideTemplate(AssessmentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AssessmentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    assessmentFormService = TestBed.inject(AssessmentFormService);
    assessmentService = TestBed.inject(AssessmentService);
    learningCompetencyService = TestBed.inject(LearningCompetencyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call LearningCompetency query and add missing value', () => {
      const assessment: IAssessment = { id: 456 };
      const learningCompetency: ILearningCompetency = { id: 21067 };
      assessment.learningCompetency = learningCompetency;

      const learningCompetencyCollection: ILearningCompetency[] = [{ id: 29620 }];
      jest.spyOn(learningCompetencyService, 'query').mockReturnValue(of(new HttpResponse({ body: learningCompetencyCollection })));
      const additionalLearningCompetencies = [learningCompetency];
      const expectedCollection: ILearningCompetency[] = [...additionalLearningCompetencies, ...learningCompetencyCollection];
      jest.spyOn(learningCompetencyService, 'addLearningCompetencyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ assessment });
      comp.ngOnInit();

      expect(learningCompetencyService.query).toHaveBeenCalled();
      expect(learningCompetencyService.addLearningCompetencyToCollectionIfMissing).toHaveBeenCalledWith(
        learningCompetencyCollection,
        ...additionalLearningCompetencies.map(expect.objectContaining),
      );
      expect(comp.learningCompetenciesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const assessment: IAssessment = { id: 456 };
      const learningCompetency: ILearningCompetency = { id: 15956 };
      assessment.learningCompetency = learningCompetency;

      activatedRoute.data = of({ assessment });
      comp.ngOnInit();

      expect(comp.learningCompetenciesSharedCollection).toContain(learningCompetency);
      expect(comp.assessment).toEqual(assessment);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAssessment>>();
      const assessment = { id: 123 };
      jest.spyOn(assessmentFormService, 'getAssessment').mockReturnValue(assessment);
      jest.spyOn(assessmentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ assessment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: assessment }));
      saveSubject.complete();

      // THEN
      expect(assessmentFormService.getAssessment).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(assessmentService.update).toHaveBeenCalledWith(expect.objectContaining(assessment));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAssessment>>();
      const assessment = { id: 123 };
      jest.spyOn(assessmentFormService, 'getAssessment').mockReturnValue({ id: null });
      jest.spyOn(assessmentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ assessment: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: assessment }));
      saveSubject.complete();

      // THEN
      expect(assessmentFormService.getAssessment).toHaveBeenCalled();
      expect(assessmentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAssessment>>();
      const assessment = { id: 123 };
      jest.spyOn(assessmentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ assessment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(assessmentService.update).toHaveBeenCalled();
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
