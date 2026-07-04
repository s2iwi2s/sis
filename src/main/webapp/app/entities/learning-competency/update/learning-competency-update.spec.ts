import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { ICurriculumMap } from 'app/entities/curriculum-map/curriculum-map.model';
import { CurriculumMapService } from 'app/entities/curriculum-map/service/curriculum-map.service';
import { ILearningCompetency } from '../learning-competency.model';
import { LearningCompetencyService } from '../service/learning-competency.service';

import { LearningCompetencyFormService } from './learning-competency-form.service';
import { LearningCompetencyUpdate } from './learning-competency-update';

describe('LearningCompetency Management Update Component', () => {
  let comp: LearningCompetencyUpdate;
  let fixture: ComponentFixture<LearningCompetencyUpdate>;
  let activatedRoute: ActivatedRoute;
  let learningCompetencyFormService: LearningCompetencyFormService;
  let learningCompetencyService: LearningCompetencyService;
  let curriculumMapService: CurriculumMapService;

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

    fixture = TestBed.createComponent(LearningCompetencyUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    learningCompetencyFormService = TestBed.inject(LearningCompetencyFormService);
    learningCompetencyService = TestBed.inject(LearningCompetencyService);
    curriculumMapService = TestBed.inject(CurriculumMapService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call CurriculumMap query and add missing value', () => {
      const learningCompetency: ILearningCompetency = { id: 20625 };
      const curriculumMap: ICurriculumMap = { id: 22840 };
      learningCompetency.curriculumMap = curriculumMap;

      const curriculumMapCollection: ICurriculumMap[] = [{ id: 22840 }];
      vitest.spyOn(curriculumMapService, 'query').mockReturnValue(of(new HttpResponse({ body: curriculumMapCollection })));
      const additionalCurriculumMaps = [curriculumMap];
      const expectedCollection: ICurriculumMap[] = [...additionalCurriculumMaps, ...curriculumMapCollection];
      vitest.spyOn(curriculumMapService, 'addCurriculumMapToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ learningCompetency });
      comp.ngOnInit();

      expect(curriculumMapService.query).toHaveBeenCalled();
      expect(curriculumMapService.addCurriculumMapToCollectionIfMissing).toHaveBeenCalledWith(
        curriculumMapCollection,
        ...additionalCurriculumMaps.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.curriculumMapsSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const learningCompetency: ILearningCompetency = { id: 20625 };
      const curriculumMap: ICurriculumMap = { id: 22840 };
      learningCompetency.curriculumMap = curriculumMap;

      activatedRoute.data = of({ learningCompetency });
      comp.ngOnInit();

      expect(comp.curriculumMapsSharedCollection()).toContainEqual(curriculumMap);
      expect(comp.learningCompetency).toEqual(learningCompetency);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<ILearningCompetency>();
      const learningCompetency = { id: 10670 };
      vitest.spyOn(learningCompetencyFormService, 'getLearningCompetency').mockReturnValue(learningCompetency);
      vitest.spyOn(learningCompetencyService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ learningCompetency });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(learningCompetency);
      saveSubject.complete();

      // THEN
      expect(learningCompetencyFormService.getLearningCompetency).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(learningCompetencyService.update).toHaveBeenCalledWith(expect.objectContaining(learningCompetency));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<ILearningCompetency>();
      const learningCompetency = { id: 10670 };
      vitest.spyOn(learningCompetencyFormService, 'getLearningCompetency').mockReturnValue({ id: null });
      vitest.spyOn(learningCompetencyService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ learningCompetency: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(learningCompetency);
      saveSubject.complete();

      // THEN
      expect(learningCompetencyFormService.getLearningCompetency).toHaveBeenCalled();
      expect(learningCompetencyService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<ILearningCompetency>();
      const learningCompetency = { id: 10670 };
      vitest.spyOn(learningCompetencyService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ learningCompetency });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(learningCompetencyService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCurriculumMap', () => {
      it('should forward to curriculumMapService', () => {
        const entity = { id: 22840 };
        const entity2 = { id: 6543 };
        vitest.spyOn(curriculumMapService, 'compareCurriculumMap');
        comp.compareCurriculumMap(entity, entity2);
        expect(curriculumMapService.compareCurriculumMap).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
