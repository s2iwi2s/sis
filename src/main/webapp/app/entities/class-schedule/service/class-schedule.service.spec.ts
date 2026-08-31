import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { IClassSchedule } from '../class-schedule.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../class-schedule.test-samples';

import { ClassScheduleService } from './class-schedule.service';

const requireRestSample: IClassSchedule = {
  ...sampleWithRequiredData,
};

describe('ClassSchedule Service', () => {
  let service: ClassScheduleService;
  let httpMock: HttpTestingController;
  let expectedResult: IClassSchedule | IClassSchedule[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(ClassScheduleService);
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

    it('should create a ClassSchedule', () => {
      const classSchedule = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(classSchedule).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ClassSchedule', () => {
      const classSchedule = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(classSchedule).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ClassSchedule', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ClassSchedule', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ClassSchedule', () => {
      service.delete(123).subscribe();

      const requests = httpMock.match({ method: 'DELETE' });
      expect(requests.length).toBe(1);
    });

    describe('addClassScheduleToCollectionIfMissing', () => {
      it('should add a ClassSchedule to an empty array', () => {
        const classSchedule: IClassSchedule = sampleWithRequiredData;
        expectedResult = service.addClassScheduleToCollectionIfMissing([], classSchedule);
        expect(expectedResult).toEqual([classSchedule]);
      });

      it('should not add a ClassSchedule to an array that contains it', () => {
        const classSchedule: IClassSchedule = sampleWithRequiredData;
        const classScheduleCollection: IClassSchedule[] = [
          {
            ...classSchedule,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addClassScheduleToCollectionIfMissing(classScheduleCollection, classSchedule);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ClassSchedule to an array that doesn't contain it", () => {
        const classSchedule: IClassSchedule = sampleWithRequiredData;
        const classScheduleCollection: IClassSchedule[] = [sampleWithPartialData];
        expectedResult = service.addClassScheduleToCollectionIfMissing(classScheduleCollection, classSchedule);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(classSchedule);
      });

      it('should add only unique ClassSchedule to an array', () => {
        const classScheduleArray: IClassSchedule[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const classScheduleCollection: IClassSchedule[] = [sampleWithRequiredData];
        expectedResult = service.addClassScheduleToCollectionIfMissing(classScheduleCollection, ...classScheduleArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const classSchedule: IClassSchedule = sampleWithRequiredData;
        const classSchedule2: IClassSchedule = sampleWithPartialData;
        expectedResult = service.addClassScheduleToCollectionIfMissing([], classSchedule, classSchedule2);
        expect(expectedResult).toEqual([classSchedule, classSchedule2]);
      });

      it('should accept null and undefined values', () => {
        const classSchedule: IClassSchedule = sampleWithRequiredData;
        expectedResult = service.addClassScheduleToCollectionIfMissing([], null, classSchedule, undefined);
        expect(expectedResult).toEqual([classSchedule]);
      });

      it('should return initial array if no ClassSchedule is added', () => {
        const classScheduleCollection: IClassSchedule[] = [sampleWithRequiredData];
        expectedResult = service.addClassScheduleToCollectionIfMissing(classScheduleCollection, undefined, null);
        expect(expectedResult).toEqual(classScheduleCollection);
      });
    });

    describe('compareClassSchedule', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareClassSchedule(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 13254 };
        const entity2 = null;

        const compareResult1 = service.compareClassSchedule(entity1, entity2);
        const compareResult2 = service.compareClassSchedule(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 13254 };
        const entity2 = { id: 8851 };

        const compareResult1 = service.compareClassSchedule(entity1, entity2);
        const compareResult2 = service.compareClassSchedule(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 13254 };
        const entity2 = { id: 13254 };

        const compareResult1 = service.compareClassSchedule(entity1, entity2);
        const compareResult2 = service.compareClassSchedule(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
