import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { ICourse } from 'app/entities/course/course.model';
import { CourseService } from 'app/entities/course/service/course.service';
import { ICurriculumMap } from '../curriculum-map.model';
import { CurriculumMapService } from '../service/curriculum-map.service';

import { CurriculumMapFormService } from './curriculum-map-form.service';
import { CurriculumMapUpdate } from './curriculum-map-update';

describe('CurriculumMap Management Update Component', () => {
  let comp: CurriculumMapUpdate;
  let fixture: ComponentFixture<CurriculumMapUpdate>;
  let activatedRoute: ActivatedRoute;
  let curriculumMapFormService: CurriculumMapFormService;
  let curriculumMapService: CurriculumMapService;
  let courseService: CourseService;

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

    fixture = TestBed.createComponent(CurriculumMapUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    curriculumMapFormService = TestBed.inject(CurriculumMapFormService);
    curriculumMapService = TestBed.inject(CurriculumMapService);
    courseService = TestBed.inject(CourseService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Course query and add missing value', () => {
      const curriculumMap: ICurriculumMap = { id: 6543 };
      const course: ICourse = { id: 2858 };
      curriculumMap.course = course;

      const courseCollection: ICourse[] = [{ id: 2858 }];
      vitest.spyOn(courseService, 'query').mockReturnValue(of(new HttpResponse({ body: courseCollection })));
      const additionalCourses = [course];
      const expectedCollection: ICourse[] = [...additionalCourses, ...courseCollection];
      vitest.spyOn(courseService, 'addCourseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ curriculumMap });
      comp.ngOnInit();

      expect(courseService.query).toHaveBeenCalled();
      expect(courseService.addCourseToCollectionIfMissing).toHaveBeenCalledWith(
        courseCollection,
        ...additionalCourses.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.coursesSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const curriculumMap: ICurriculumMap = { id: 6543 };
      const course: ICourse = { id: 2858 };
      curriculumMap.course = course;

      activatedRoute.data = of({ curriculumMap });
      comp.ngOnInit();

      expect(comp.coursesSharedCollection()).toContainEqual(course);
      expect(comp.curriculumMap).toEqual(curriculumMap);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<ICurriculumMap>();
      const curriculumMap = { id: 22840 };
      vitest.spyOn(curriculumMapFormService, 'getCurriculumMap').mockReturnValue(curriculumMap);
      vitest.spyOn(curriculumMapService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ curriculumMap });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(curriculumMap);
      saveSubject.complete();

      // THEN
      expect(curriculumMapFormService.getCurriculumMap).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(curriculumMapService.update).toHaveBeenCalledWith(expect.objectContaining(curriculumMap));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<ICurriculumMap>();
      const curriculumMap = { id: 22840 };
      vitest.spyOn(curriculumMapFormService, 'getCurriculumMap').mockReturnValue({ id: null });
      vitest.spyOn(curriculumMapService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ curriculumMap: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(curriculumMap);
      saveSubject.complete();

      // THEN
      expect(curriculumMapFormService.getCurriculumMap).toHaveBeenCalled();
      expect(curriculumMapService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<ICurriculumMap>();
      const curriculumMap = { id: 22840 };
      vitest.spyOn(curriculumMapService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ curriculumMap });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(curriculumMapService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCourse', () => {
      it('should forward to courseService', () => {
        const entity = { id: 2858 };
        const entity2 = { id: 3722 };
        vitest.spyOn(courseService, 'compareCourse');
        comp.compareCourse(entity, entity2);
        expect(courseService.compareCourse).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
