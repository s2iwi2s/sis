import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IStrategies } from '../strategies.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../strategies.test-samples';

import { StrategiesService, RestStrategies } from './strategies.service';

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
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(StrategiesService);
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

    it('should create a Strategies', () => {
      const strategies = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(strategies).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Strategies', () => {
      const strategies = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(strategies).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Strategies', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

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
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addStrategiesToCollectionIfMissing', () => {
      it('should add a Strategies to an empty array', () => {
        const strategies: IStrategies = sampleWithRequiredData;
        expectedResult = service.addStrategiesToCollectionIfMissing([], strategies);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(strategies);
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
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(strategies);
        expect(expectedResult).toContain(strategies2);
      });

      it('should accept null and undefined values', () => {
        const strategies: IStrategies = sampleWithRequiredData;
        expectedResult = service.addStrategiesToCollectionIfMissing([], null, strategies, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(strategies);
      });

      it('should return initial array if no Strategies is added', () => {
        const strategiesCollection: IStrategies[] = [sampleWithRequiredData];
        expectedResult = service.addStrategiesToCollectionIfMissing(strategiesCollection, undefined, null);
        expect(expectedResult).toEqual(strategiesCollection);
      });
    });

    describe('compareStrategies', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareStrategies(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareStrategies(entity1, entity2);
        const compareResult2 = service.compareStrategies(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareStrategies(entity1, entity2);
        const compareResult2 = service.compareStrategies(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

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
