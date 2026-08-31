import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { IGradeLevelPayables } from '../grade-level-payables.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../grade-level-payables.test-samples';

import { GradeLevelPayablesService } from './grade-level-payables.service';

const requireRestSample: IGradeLevelPayables = {
  ...sampleWithRequiredData,
};

describe('GradeLevelPayables Service', () => {
  let service: GradeLevelPayablesService;
  let httpMock: HttpTestingController;
  let expectedResult: IGradeLevelPayables | IGradeLevelPayables[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(GradeLevelPayablesService);
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

    it('should create a GradeLevelPayables', () => {
      const gradeLevelPayables = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(gradeLevelPayables).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a GradeLevelPayables', () => {
      const gradeLevelPayables = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(gradeLevelPayables).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a GradeLevelPayables', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of GradeLevelPayables', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a GradeLevelPayables', () => {
      service.delete(123).subscribe();

      const requests = httpMock.match({ method: 'DELETE' });
      expect(requests.length).toBe(1);
    });

    describe('addGradeLevelPayablesToCollectionIfMissing', () => {
      it('should add a GradeLevelPayables to an empty array', () => {
        const gradeLevelPayables: IGradeLevelPayables = sampleWithRequiredData;
        expectedResult = service.addGradeLevelPayablesToCollectionIfMissing([], gradeLevelPayables);
        expect(expectedResult).toEqual([gradeLevelPayables]);
      });

      it('should not add a GradeLevelPayables to an array that contains it', () => {
        const gradeLevelPayables: IGradeLevelPayables = sampleWithRequiredData;
        const gradeLevelPayablesCollection: IGradeLevelPayables[] = [
          {
            ...gradeLevelPayables,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addGradeLevelPayablesToCollectionIfMissing(gradeLevelPayablesCollection, gradeLevelPayables);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a GradeLevelPayables to an array that doesn't contain it", () => {
        const gradeLevelPayables: IGradeLevelPayables = sampleWithRequiredData;
        const gradeLevelPayablesCollection: IGradeLevelPayables[] = [sampleWithPartialData];
        expectedResult = service.addGradeLevelPayablesToCollectionIfMissing(gradeLevelPayablesCollection, gradeLevelPayables);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(gradeLevelPayables);
      });

      it('should add only unique GradeLevelPayables to an array', () => {
        const gradeLevelPayablesArray: IGradeLevelPayables[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const gradeLevelPayablesCollection: IGradeLevelPayables[] = [sampleWithRequiredData];
        expectedResult = service.addGradeLevelPayablesToCollectionIfMissing(gradeLevelPayablesCollection, ...gradeLevelPayablesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const gradeLevelPayables: IGradeLevelPayables = sampleWithRequiredData;
        const gradeLevelPayables2: IGradeLevelPayables = sampleWithPartialData;
        expectedResult = service.addGradeLevelPayablesToCollectionIfMissing([], gradeLevelPayables, gradeLevelPayables2);
        expect(expectedResult).toEqual([gradeLevelPayables, gradeLevelPayables2]);
      });

      it('should accept null and undefined values', () => {
        const gradeLevelPayables: IGradeLevelPayables = sampleWithRequiredData;
        expectedResult = service.addGradeLevelPayablesToCollectionIfMissing([], null, gradeLevelPayables, undefined);
        expect(expectedResult).toEqual([gradeLevelPayables]);
      });

      it('should return initial array if no GradeLevelPayables is added', () => {
        const gradeLevelPayablesCollection: IGradeLevelPayables[] = [sampleWithRequiredData];
        expectedResult = service.addGradeLevelPayablesToCollectionIfMissing(gradeLevelPayablesCollection, undefined, null);
        expect(expectedResult).toEqual(gradeLevelPayablesCollection);
      });
    });

    describe('compareGradeLevelPayables', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareGradeLevelPayables(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 14057 };
        const entity2 = null;

        const compareResult1 = service.compareGradeLevelPayables(entity1, entity2);
        const compareResult2 = service.compareGradeLevelPayables(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 14057 };
        const entity2 = { id: 27978 };

        const compareResult1 = service.compareGradeLevelPayables(entity1, entity2);
        const compareResult2 = service.compareGradeLevelPayables(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 14057 };
        const entity2 = { id: 14057 };

        const compareResult1 = service.compareGradeLevelPayables(entity1, entity2);
        const compareResult2 = service.compareGradeLevelPayables(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
