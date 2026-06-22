import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICourse } from '../course.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../course.test-samples';

import { CourseService, RestCourse } from './course.service';

const requireRestSample: RestCourse = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('Course Service', () => {
  let service: CourseService;
  let httpMock: HttpTestingController;
  let expectedResult: ICourse | ICourse[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CourseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Course', () => {
      const course = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(course).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Course', () => {
      const course = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(course).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Course', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Course', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Course', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCourseToCollectionIfMissing', () => {
      it('should add a Course to an empty array', () => {
        const course: ICourse = sampleWithRequiredData;
        expectedResult = service.addCourseToCollectionIfMissing([], course);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(course);
      });

      it('should not add a Course to an array that contains it', () => {
        const course: ICourse = sampleWithRequiredData;
        const courseCollection: ICourse[] = [
          {
            ...course,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCourseToCollectionIfMissing(courseCollection, course);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Course to an array that doesn't contain it", () => {
        const course: ICourse = sampleWithRequiredData;
        const courseCollection: ICourse[] = [sampleWithPartialData];
        expectedResult = service.addCourseToCollectionIfMissing(courseCollection, course);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(course);
      });

      it('should add only unique Course to an array', () => {
        const courseArray: ICourse[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const courseCollection: ICourse[] = [sampleWithRequiredData];
        expectedResult = service.addCourseToCollectionIfMissing(courseCollection, ...courseArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const course: ICourse = sampleWithRequiredData;
        const course2: ICourse = sampleWithPartialData;
        expectedResult = service.addCourseToCollectionIfMissing([], course, course2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(course);
        expect(expectedResult).toContain(course2);
      });

      it('should accept null and undefined values', () => {
        const course: ICourse = sampleWithRequiredData;
        expectedResult = service.addCourseToCollectionIfMissing([], null, course, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(course);
      });

      it('should return initial array if no Course is added', () => {
        const courseCollection: ICourse[] = [sampleWithRequiredData];
        expectedResult = service.addCourseToCollectionIfMissing(courseCollection, undefined, null);
        expect(expectedResult).toEqual(courseCollection);
      });
    });

    describe('compareCourse', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCourse(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCourse(entity1, entity2);
        const compareResult2 = service.compareCourse(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCourse(entity1, entity2);
        const compareResult2 = service.compareCourse(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCourse(entity1, entity2);
        const compareResult2 = service.compareCourse(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
