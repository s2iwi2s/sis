import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ICurriculumMap } from 'app/entities/curriculum-map/curriculum-map.model';
import { CurriculumMapService } from 'app/entities/curriculum-map/service/curriculum-map.service';
import { LearningCompetencyService } from '../service/learning-competency.service';
import { ILearningCompetency } from '../learning-competency.model';
import { LearningCompetencyFormService } from './learning-competency-form.service';

import { LearningCompetencyUpdateComponent } from './learning-competency-update.component';

describe('LearningCompetency Management Update Component', () => {
  let comp: LearningCompetencyUpdateComponent;
  let fixture: ComponentFixture<LearningCompetencyUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let learningCompetencyFormService: LearningCompetencyFormService;
  let learningCompetencyService: LearningCompetencyService;
  let curriculumMapService: CurriculumMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), LearningCompetencyUpdateComponent],
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
      .overrideTemplate(LearningCompetencyUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LearningCompetencyUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    learningCompetencyFormService = TestBed.inject(LearningCompetencyFormService);
    learningCompetencyService = TestBed.inject(LearningCompetencyService);
    curriculumMapService = TestBed.inject(CurriculumMapService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call CurriculumMap query and add missing value', () => {
      const learningCompetency: ILearningCompetency = { id: 456 };
      const curriculumMap: ICurriculumMap = { id: 21426 };
      learningCompetency.curriculumMap = curriculumMap;

      const curriculumMapCollection: ICurriculumMap[] = [{ id: 28282 }];
      jest.spyOn(curriculumMapService, 'query').mockReturnValue(of(new HttpResponse({ body: curriculumMapCollection })));
      const additionalCurriculumMaps = [curriculumMap];
      const expectedCollection: ICurriculumMap[] = [...additionalCurriculumMaps, ...curriculumMapCollection];
      jest.spyOn(curriculumMapService, 'addCurriculumMapToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ learningCompetency });
      comp.ngOnInit();

      expect(curriculumMapService.query).toHaveBeenCalled();
      expect(curriculumMapService.addCurriculumMapToCollectionIfMissing).toHaveBeenCalledWith(
        curriculumMapCollection,
        ...additionalCurriculumMaps.map(expect.objectContaining),
      );
      expect(comp.curriculumMapsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const learningCompetency: ILearningCompetency = { id: 456 };
      const curriculumMap: ICurriculumMap = { id: 9253 };
      learningCompetency.curriculumMap = curriculumMap;

      activatedRoute.data = of({ learningCompetency });
      comp.ngOnInit();

      expect(comp.curriculumMapsSharedCollection).toContain(curriculumMap);
      expect(comp.learningCompetency).toEqual(learningCompetency);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILearningCompetency>>();
      const learningCompetency = { id: 123 };
      jest.spyOn(learningCompetencyFormService, 'getLearningCompetency').mockReturnValue(learningCompetency);
      jest.spyOn(learningCompetencyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ learningCompetency });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: learningCompetency }));
      saveSubject.complete();

      // THEN
      expect(learningCompetencyFormService.getLearningCompetency).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(learningCompetencyService.update).toHaveBeenCalledWith(expect.objectContaining(learningCompetency));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILearningCompetency>>();
      const learningCompetency = { id: 123 };
      jest.spyOn(learningCompetencyFormService, 'getLearningCompetency').mockReturnValue({ id: null });
      jest.spyOn(learningCompetencyService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ learningCompetency: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: learningCompetency }));
      saveSubject.complete();

      // THEN
      expect(learningCompetencyFormService.getLearningCompetency).toHaveBeenCalled();
      expect(learningCompetencyService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILearningCompetency>>();
      const learningCompetency = { id: 123 };
      jest.spyOn(learningCompetencyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ learningCompetency });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(learningCompetencyService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCurriculumMap', () => {
      it('Should forward to curriculumMapService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(curriculumMapService, 'compareCurriculumMap');
        comp.compareCurriculumMap(entity, entity2);
        expect(curriculumMapService.compareCurriculumMap).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
