import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IAcademicTerms } from '../academic-terms.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../academic-terms.test-samples';

import { AcademicTermsService, RestAcademicTerms } from './academic-terms.service';

const requireRestSample: RestAcademicTerms = {
  ...sampleWithRequiredData,
  startDate: sampleWithRequiredData.startDate?.format(DATE_FORMAT),
  endDate: sampleWithRequiredData.endDate?.format(DATE_FORMAT),
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('AcademicTerms Service', () => {
  let service: AcademicTermsService;
  let httpMock: HttpTestingController;
  let expectedResult: IAcademicTerms | IAcademicTerms[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(AcademicTermsService);
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

    it('should create a AcademicTerms', () => {
      const academicTerms = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(academicTerms).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AcademicTerms', () => {
      const academicTerms = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(academicTerms).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AcademicTerms', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AcademicTerms', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a AcademicTerms', () => {
      service.delete(123).subscribe();

      const requests = httpMock.match({ method: 'DELETE' });
      expect(requests.length).toBe(1);
    });

    describe('addAcademicTermsToCollectionIfMissing', () => {
      it('should add a AcademicTerms to an empty array', () => {
        const academicTerms: IAcademicTerms = sampleWithRequiredData;
        expectedResult = service.addAcademicTermsToCollectionIfMissing([], academicTerms);
        expect(expectedResult).toEqual([academicTerms]);
      });

      it('should not add a AcademicTerms to an array that contains it', () => {
        const academicTerms: IAcademicTerms = sampleWithRequiredData;
        const academicTermsCollection: IAcademicTerms[] = [
          {
            ...academicTerms,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAcademicTermsToCollectionIfMissing(academicTermsCollection, academicTerms);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AcademicTerms to an array that doesn't contain it", () => {
        const academicTerms: IAcademicTerms = sampleWithRequiredData;
        const academicTermsCollection: IAcademicTerms[] = [sampleWithPartialData];
        expectedResult = service.addAcademicTermsToCollectionIfMissing(academicTermsCollection, academicTerms);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(academicTerms);
      });

      it('should add only unique AcademicTerms to an array', () => {
        const academicTermsArray: IAcademicTerms[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const academicTermsCollection: IAcademicTerms[] = [sampleWithRequiredData];
        expectedResult = service.addAcademicTermsToCollectionIfMissing(academicTermsCollection, ...academicTermsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const academicTerms: IAcademicTerms = sampleWithRequiredData;
        const academicTerms2: IAcademicTerms = sampleWithPartialData;
        expectedResult = service.addAcademicTermsToCollectionIfMissing([], academicTerms, academicTerms2);
        expect(expectedResult).toEqual([academicTerms, academicTerms2]);
      });

      it('should accept null and undefined values', () => {
        const academicTerms: IAcademicTerms = sampleWithRequiredData;
        expectedResult = service.addAcademicTermsToCollectionIfMissing([], null, academicTerms, undefined);
        expect(expectedResult).toEqual([academicTerms]);
      });

      it('should return initial array if no AcademicTerms is added', () => {
        const academicTermsCollection: IAcademicTerms[] = [sampleWithRequiredData];
        expectedResult = service.addAcademicTermsToCollectionIfMissing(academicTermsCollection, undefined, null);
        expect(expectedResult).toEqual(academicTermsCollection);
      });
    });

    describe('compareAcademicTerms', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAcademicTerms(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 24556 };
        const entity2 = null;

        const compareResult1 = service.compareAcademicTerms(entity1, entity2);
        const compareResult2 = service.compareAcademicTerms(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 24556 };
        const entity2 = { id: 20035 };

        const compareResult1 = service.compareAcademicTerms(entity1, entity2);
        const compareResult2 = service.compareAcademicTerms(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 24556 };
        const entity2 = { id: 24556 };

        const compareResult1 = service.compareAcademicTerms(entity1, entity2);
        const compareResult2 = service.compareAcademicTerms(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
