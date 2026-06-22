import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IAppConfig } from 'app/entities/app-config/app-config.model';
import { AppConfigService } from 'app/entities/app-config/service/app-config.service';
import { ICourse } from 'app/entities/course/course.model';
import { CourseService } from 'app/entities/course/service/course.service';
import { IInstructor } from '../instructor.model';
import { InstructorService } from '../service/instructor.service';
import { InstructorFormService } from './instructor-form.service';

import { InstructorUpdateComponent } from './instructor-update.component';

describe('Instructor Management Update Component', () => {
  let comp: InstructorUpdateComponent;
  let fixture: ComponentFixture<InstructorUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let instructorFormService: InstructorFormService;
  let instructorService: InstructorService;
  let appConfigService: AppConfigService;
  let courseService: CourseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), InstructorUpdateComponent],
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
      .overrideTemplate(InstructorUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InstructorUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    instructorFormService = TestBed.inject(InstructorFormService);
    instructorService = TestBed.inject(InstructorService);
    appConfigService = TestBed.inject(AppConfigService);
    courseService = TestBed.inject(CourseService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call gender query and add missing value', () => {
      const instructor: IInstructor = { id: 456 };
      const gender: IAppConfig = { id: 17719 };
      instructor.gender = gender;

      const genderCollection: IAppConfig[] = [{ id: 29879 }];
      jest.spyOn(appConfigService, 'query').mockReturnValue(of(new HttpResponse({ body: genderCollection })));
      const expectedCollection: IAppConfig[] = [gender, ...genderCollection];
      jest.spyOn(appConfigService, 'addAppConfigToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ instructor });
      comp.ngOnInit();

      expect(appConfigService.query).toHaveBeenCalled();
      expect(appConfigService.addAppConfigToCollectionIfMissing).toHaveBeenCalledWith(genderCollection, gender);
      expect(comp.gendersCollection).toEqual(expectedCollection);
    });

    it('Should call Course query and add missing value', () => {
      const instructor: IInstructor = { id: 456 };
      const courses: ICourse[] = [{ id: 12636 }];
      instructor.courses = courses;

      const courseCollection: ICourse[] = [{ id: 19151 }];
      jest.spyOn(courseService, 'query').mockReturnValue(of(new HttpResponse({ body: courseCollection })));
      const additionalCourses = [...courses];
      const expectedCollection: ICourse[] = [...additionalCourses, ...courseCollection];
      jest.spyOn(courseService, 'addCourseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ instructor });
      comp.ngOnInit();

      expect(courseService.query).toHaveBeenCalled();
      expect(courseService.addCourseToCollectionIfMissing).toHaveBeenCalledWith(
        courseCollection,
        ...additionalCourses.map(expect.objectContaining),
      );
      expect(comp.coursesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const instructor: IInstructor = { id: 456 };
      const gender: IAppConfig = { id: 25188 };
      instructor.gender = gender;
      const course: ICourse = { id: 13355 };
      instructor.courses = [course];

      activatedRoute.data = of({ instructor });
      comp.ngOnInit();

      expect(comp.gendersCollection).toContain(gender);
      expect(comp.coursesSharedCollection).toContain(course);
      expect(comp.instructor).toEqual(instructor);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInstructor>>();
      const instructor = { id: 123 };
      jest.spyOn(instructorFormService, 'getInstructor').mockReturnValue(instructor);
      jest.spyOn(instructorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ instructor });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: instructor }));
      saveSubject.complete();

      // THEN
      expect(instructorFormService.getInstructor).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(instructorService.update).toHaveBeenCalledWith(expect.objectContaining(instructor));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInstructor>>();
      const instructor = { id: 123 };
      jest.spyOn(instructorFormService, 'getInstructor').mockReturnValue({ id: null });
      jest.spyOn(instructorService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ instructor: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: instructor }));
      saveSubject.complete();

      // THEN
      expect(instructorFormService.getInstructor).toHaveBeenCalled();
      expect(instructorService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInstructor>>();
      const instructor = { id: 123 };
      jest.spyOn(instructorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ instructor });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(instructorService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAppConfig', () => {
      it('Should forward to appConfigService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(appConfigService, 'compareAppConfig');
        comp.compareAppConfig(entity, entity2);
        expect(appConfigService.compareAppConfig).toHaveBeenCalledWith(entity, entity2);
      });
    });

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
