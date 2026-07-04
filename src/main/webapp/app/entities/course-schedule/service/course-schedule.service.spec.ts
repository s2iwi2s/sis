import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ICourseSchedule } from '../course-schedule.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../course-schedule.test-samples';

import { CourseScheduleService, RestCourseSchedule } from './course-schedule.service';

const requireRestSample: RestCourseSchedule = {
  ...sampleWithRequiredData,
  startTime: sampleWithRequiredData.startTime?.toJSON(),
  endTime: sampleWithRequiredData.endTime?.toJSON(),
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('CourseSchedule Service', () => {
  let service: CourseScheduleService;
  let httpMock: HttpTestingController;
  let expectedResult: ICourseSchedule | ICourseSchedule[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(CourseScheduleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a CourseSchedule', () => {
      const courseSchedule = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(courseSchedule).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CourseSchedule', () => {
      const courseSchedule = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(courseSchedule).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CourseSchedule', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CourseSchedule', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CourseSchedule', () => {
      service.delete(123).subscribe();

      const requests = httpMock.match({ method: 'DELETE' });
      expect(requests.length).toBe(1);
    });

    describe('addCourseScheduleToCollectionIfMissing', () => {
      it('should add a CourseSchedule to an empty array', () => {
        const courseSchedule: ICourseSchedule = sampleWithRequiredData;
        expectedResult = service.addCourseScheduleToCollectionIfMissing([], courseSchedule);
        expect(expectedResult).toEqual([courseSchedule]);
      });

      it('should not add a CourseSchedule to an array that contains it', () => {
        const courseSchedule: ICourseSchedule = sampleWithRequiredData;
        const courseScheduleCollection: ICourseSchedule[] = [
          {
            ...courseSchedule,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCourseScheduleToCollectionIfMissing(courseScheduleCollection, courseSchedule);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CourseSchedule to an array that doesn't contain it", () => {
        const courseSchedule: ICourseSchedule = sampleWithRequiredData;
        const courseScheduleCollection: ICourseSchedule[] = [sampleWithPartialData];
        expectedResult = service.addCourseScheduleToCollectionIfMissing(courseScheduleCollection, courseSchedule);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(courseSchedule);
      });

      it('should add only unique CourseSchedule to an array', () => {
        const courseScheduleArray: ICourseSchedule[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const courseScheduleCollection: ICourseSchedule[] = [sampleWithRequiredData];
        expectedResult = service.addCourseScheduleToCollectionIfMissing(courseScheduleCollection, ...courseScheduleArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const courseSchedule: ICourseSchedule = sampleWithRequiredData;
        const courseSchedule2: ICourseSchedule = sampleWithPartialData;
        expectedResult = service.addCourseScheduleToCollectionIfMissing([], courseSchedule, courseSchedule2);
        expect(expectedResult).toEqual([courseSchedule, courseSchedule2]);
      });

      it('should accept null and undefined values', () => {
        const courseSchedule: ICourseSchedule = sampleWithRequiredData;
        expectedResult = service.addCourseScheduleToCollectionIfMissing([], null, courseSchedule, undefined);
        expect(expectedResult).toEqual([courseSchedule]);
      });

      it('should return initial array if no CourseSchedule is added', () => {
        const courseScheduleCollection: ICourseSchedule[] = [sampleWithRequiredData];
        expectedResult = service.addCourseScheduleToCollectionIfMissing(courseScheduleCollection, undefined, null);
        expect(expectedResult).toEqual(courseScheduleCollection);
      });
    });

    describe('compareCourseSchedule', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCourseSchedule(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 3926 };
        const entity2 = null;

        const compareResult1 = service.compareCourseSchedule(entity1, entity2);
        const compareResult2 = service.compareCourseSchedule(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 3926 };
        const entity2 = { id: 1257 };

        const compareResult1 = service.compareCourseSchedule(entity1, entity2);
        const compareResult2 = service.compareCourseSchedule(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 3926 };
        const entity2 = { id: 3926 };

        const compareResult1 = service.compareCourseSchedule(entity1, entity2);
        const compareResult2 = service.compareCourseSchedule(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
