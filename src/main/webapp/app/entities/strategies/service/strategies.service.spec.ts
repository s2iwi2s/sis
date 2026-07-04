import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { IStrategies } from '../strategies.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../strategies.test-samples';

import { RestStrategies, StrategiesService } from './strategies.service';

const requireRestSample: RestStrategies = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('Strategies Service', () => {
  let service: StrategiesService;
  let httpMock: HttpTestingController;
  let expectedResult: IStrategies | IStrategies[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(StrategiesService);
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

    it('should create a Strategies', () => {
      const strategies = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(strategies).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Strategies', () => {
      const strategies = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(strategies).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Strategies', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Strategies', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Strategies', () => {
      service.delete(123).subscribe();

      const requests = httpMock.match({ method: 'DELETE' });
      expect(requests.length).toBe(1);
    });

    describe('addStrategiesToCollectionIfMissing', () => {
      it('should add a Strategies to an empty array', () => {
        const strategies: IStrategies = sampleWithRequiredData;
        expectedResult = service.addStrategiesToCollectionIfMissing([], strategies);
        expect(expectedResult).toEqual([strategies]);
      });

      it('should not add a Strategies to an array that contains it', () => {
        const strategies: IStrategies = sampleWithRequiredData;
        const strategiesCollection: IStrategies[] = [
          {
            ...strategies,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addStrategiesToCollectionIfMissing(strategiesCollection, strategies);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Strategies to an array that doesn't contain it", () => {
        const strategies: IStrategies = sampleWithRequiredData;
        const strategiesCollection: IStrategies[] = [sampleWithPartialData];
        expectedResult = service.addStrategiesToCollectionIfMissing(strategiesCollection, strategies);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(strategies);
      });

      it('should add only unique Strategies to an array', () => {
        const strategiesArray: IStrategies[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const strategiesCollection: IStrategies[] = [sampleWithRequiredData];
        expectedResult = service.addStrategiesToCollectionIfMissing(strategiesCollection, ...strategiesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const strategies: IStrategies = sampleWithRequiredData;
        const strategies2: IStrategies = sampleWithPartialData;
        expectedResult = service.addStrategiesToCollectionIfMissing([], strategies, strategies2);
        expect(expectedResult).toEqual([strategies, strategies2]);
      });

      it('should accept null and undefined values', () => {
        const strategies: IStrategies = sampleWithRequiredData;
        expectedResult = service.addStrategiesToCollectionIfMissing([], null, strategies, undefined);
        expect(expectedResult).toEqual([strategies]);
      });

      it('should return initial array if no Strategies is added', () => {
        const strategiesCollection: IStrategies[] = [sampleWithRequiredData];
        expectedResult = service.addStrategiesToCollectionIfMissing(strategiesCollection, undefined, null);
        expect(expectedResult).toEqual(strategiesCollection);
      });
    });

    describe('compareStrategies', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareStrategies(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 3934 };
        const entity2 = null;

        const compareResult1 = service.compareStrategies(entity1, entity2);
        const compareResult2 = service.compareStrategies(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 3934 };
        const entity2 = { id: 26831 };

        const compareResult1 = service.compareStrategies(entity1, entity2);
        const compareResult2 = service.compareStrategies(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 3934 };
        const entity2 = { id: 3934 };

        const compareResult1 = service.compareStrategies(entity1, entity2);
        const compareResult2 = service.compareStrategies(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
