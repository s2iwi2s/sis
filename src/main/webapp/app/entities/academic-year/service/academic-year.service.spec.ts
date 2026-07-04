import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IAcademicYear } from '../academic-year.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../academic-year.test-samples';

import { AcademicYearService, RestAcademicYear } from './academic-year.service';

const requireRestSample: RestAcademicYear = {
  ...sampleWithRequiredData,
  startDate: sampleWithRequiredData.startDate?.format(DATE_FORMAT),
  endDate: sampleWithRequiredData.endDate?.format(DATE_FORMAT),
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('AcademicYear Service', () => {
  let service: AcademicYearService;
  let httpMock: HttpTestingController;
  let expectedResult: IAcademicYear | IAcademicYear[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(AcademicYearService);
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

    it('should create a AcademicYear', () => {
      const academicYear = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(academicYear).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AcademicYear', () => {
      const academicYear = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(academicYear).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AcademicYear', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AcademicYear', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a AcademicYear', () => {
      service.delete(123).subscribe();

      const requests = httpMock.match({ method: 'DELETE' });
      expect(requests.length).toBe(1);
    });

    describe('addAcademicYearToCollectionIfMissing', () => {
      it('should add a AcademicYear to an empty array', () => {
        const academicYear: IAcademicYear = sampleWithRequiredData;
        expectedResult = service.addAcademicYearToCollectionIfMissing([], academicYear);
        expect(expectedResult).toEqual([academicYear]);
      });

      it('should not add a AcademicYear to an array that contains it', () => {
        const academicYear: IAcademicYear = sampleWithRequiredData;
        const academicYearCollection: IAcademicYear[] = [
          {
            ...academicYear,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAcademicYearToCollectionIfMissing(academicYearCollection, academicYear);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AcademicYear to an array that doesn't contain it", () => {
        const academicYear: IAcademicYear = sampleWithRequiredData;
        const academicYearCollection: IAcademicYear[] = [sampleWithPartialData];
        expectedResult = service.addAcademicYearToCollectionIfMissing(academicYearCollection, academicYear);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(academicYear);
      });

      it('should add only unique AcademicYear to an array', () => {
        const academicYearArray: IAcademicYear[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const academicYearCollection: IAcademicYear[] = [sampleWithRequiredData];
        expectedResult = service.addAcademicYearToCollectionIfMissing(academicYearCollection, ...academicYearArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const academicYear: IAcademicYear = sampleWithRequiredData;
        const academicYear2: IAcademicYear = sampleWithPartialData;
        expectedResult = service.addAcademicYearToCollectionIfMissing([], academicYear, academicYear2);
        expect(expectedResult).toEqual([academicYear, academicYear2]);
      });

      it('should accept null and undefined values', () => {
        const academicYear: IAcademicYear = sampleWithRequiredData;
        expectedResult = service.addAcademicYearToCollectionIfMissing([], null, academicYear, undefined);
        expect(expectedResult).toEqual([academicYear]);
      });

      it('should return initial array if no AcademicYear is added', () => {
        const academicYearCollection: IAcademicYear[] = [sampleWithRequiredData];
        expectedResult = service.addAcademicYearToCollectionIfMissing(academicYearCollection, undefined, null);
        expect(expectedResult).toEqual(academicYearCollection);
      });
    });

    describe('compareAcademicYear', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAcademicYear(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 29518 };
        const entity2 = null;

        const compareResult1 = service.compareAcademicYear(entity1, entity2);
        const compareResult2 = service.compareAcademicYear(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 29518 };
        const entity2 = { id: 7197 };

        const compareResult1 = service.compareAcademicYear(entity1, entity2);
        const compareResult2 = service.compareAcademicYear(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 29518 };
        const entity2 = { id: 29518 };

        const compareResult1 = service.compareAcademicYear(entity1, entity2);
        const compareResult2 = service.compareAcademicYear(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
