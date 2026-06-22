import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ICourse } from 'app/entities/course/course.model';
import { CourseService } from 'app/entities/course/service/course.service';
import { CurriculumMapService } from '../service/curriculum-map.service';
import { ICurriculumMap } from '../curriculum-map.model';
import { CurriculumMapFormService } from './curriculum-map-form.service';

import { CurriculumMapUpdateComponent } from './curriculum-map-update.component';

describe('CurriculumMap Management Update Component', () => {
  let comp: CurriculumMapUpdateComponent;
  let fixture: ComponentFixture<CurriculumMapUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let curriculumMapFormService: CurriculumMapFormService;
  let curriculumMapService: CurriculumMapService;
  let courseService: CourseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), CurriculumMapUpdateComponent],
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
      .overrideTemplate(CurriculumMapUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CurriculumMapUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    curriculumMapFormService = TestBed.inject(CurriculumMapFormService);
    curriculumMapService = TestBed.inject(CurriculumMapService);
    courseService = TestBed.inject(CourseService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Course query and add missing value', () => {
      const curriculumMap: ICurriculumMap = { id: 456 };
      const course: ICourse = { id: 308 };
      curriculumMap.course = course;

      const courseCollection: ICourse[] = [{ id: 18902 }];
      jest.spyOn(courseService, 'query').mockReturnValue(of(new HttpResponse({ body: courseCollection })));
      const additionalCourses = [course];
      const expectedCollection: ICourse[] = [...additionalCourses, ...courseCollection];
      jest.spyOn(courseService, 'addCourseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ curriculumMap });
      comp.ngOnInit();

      expect(courseService.query).toHaveBeenCalled();
      expect(courseService.addCourseToCollectionIfMissing).toHaveBeenCalledWith(
        courseCollection,
        ...additionalCourses.map(expect.objectContaining),
      );
      expect(comp.coursesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const curriculumMap: ICurriculumMap = { id: 456 };
      const course: ICourse = { id: 10412 };
      curriculumMap.course = course;

      activatedRoute.data = of({ curriculumMap });
      comp.ngOnInit();

      expect(comp.coursesSharedCollection).toContain(course);
      expect(comp.curriculumMap).toEqual(curriculumMap);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICurriculumMap>>();
      const curriculumMap = { id: 123 };
      jest.spyOn(curriculumMapFormService, 'getCurriculumMap').mockReturnValue(curriculumMap);
      jest.spyOn(curriculumMapService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ curriculumMap });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: curriculumMap }));
      saveSubject.complete();

      // THEN
      expect(curriculumMapFormService.getCurriculumMap).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(curriculumMapService.update).toHaveBeenCalledWith(expect.objectContaining(curriculumMap));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICurriculumMap>>();
      const curriculumMap = { id: 123 };
      jest.spyOn(curriculumMapFormService, 'getCurriculumMap').mockReturnValue({ id: null });
      jest.spyOn(curriculumMapService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ curriculumMap: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: curriculumMap }));
      saveSubject.complete();

      // THEN
      expect(curriculumMapFormService.getCurriculumMap).toHaveBeenCalled();
      expect(curriculumMapService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICurriculumMap>>();
      const curriculumMap = { id: 123 };
      jest.spyOn(curriculumMapService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ curriculumMap });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(curriculumMapService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCourse', () => {
      it('Should forward to courseService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(courseService, 'compareCourse');
        comp.compareCourse(entity, entity2);
        expect(courseService.compareCourse).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
