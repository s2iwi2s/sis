import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IAccountPayables } from '../account-payables.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../account-payables.test-samples';

import { AccountPayablesService, RestAccountPayables } from './account-payables.service';

const requireRestSample: RestAccountPayables = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.format(DATE_FORMAT),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.format(DATE_FORMAT),
};

describe('AccountPayables Service', () => {
  let service: AccountPayablesService;
  let httpMock: HttpTestingController;
  let expectedResult: IAccountPayables | IAccountPayables[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(AccountPayablesService);
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

    it('should create a AccountPayables', () => {
      const accountPayables = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(accountPayables).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AccountPayables', () => {
      const accountPayables = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(accountPayables).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AccountPayables', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AccountPayables', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a AccountPayables', () => {
      service.delete(123).subscribe();

      const requests = httpMock.match({ method: 'DELETE' });
      expect(requests.length).toBe(1);
    });

    describe('addAccountPayablesToCollectionIfMissing', () => {
      it('should add a AccountPayables to an empty array', () => {
        const accountPayables: IAccountPayables = sampleWithRequiredData;
        expectedResult = service.addAccountPayablesToCollectionIfMissing([], accountPayables);
        expect(expectedResult).toEqual([accountPayables]);
      });

      it('should not add a AccountPayables to an array that contains it', () => {
        const accountPayables: IAccountPayables = sampleWithRequiredData;
        const accountPayablesCollection: IAccountPayables[] = [
          {
            ...accountPayables,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAccountPayablesToCollectionIfMissing(accountPayablesCollection, accountPayables);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AccountPayables to an array that doesn't contain it", () => {
        const accountPayables: IAccountPayables = sampleWithRequiredData;
        const accountPayablesCollection: IAccountPayables[] = [sampleWithPartialData];
        expectedResult = service.addAccountPayablesToCollectionIfMissing(accountPayablesCollection, accountPayables);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(accountPayables);
      });

      it('should add only unique AccountPayables to an array', () => {
        const accountPayablesArray: IAccountPayables[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const accountPayablesCollection: IAccountPayables[] = [sampleWithRequiredData];
        expectedResult = service.addAccountPayablesToCollectionIfMissing(accountPayablesCollection, ...accountPayablesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const accountPayables: IAccountPayables = sampleWithRequiredData;
        const accountPayables2: IAccountPayables = sampleWithPartialData;
        expectedResult = service.addAccountPayablesToCollectionIfMissing([], accountPayables, accountPayables2);
        expect(expectedResult).toEqual([accountPayables, accountPayables2]);
      });

      it('should accept null and undefined values', () => {
        const accountPayables: IAccountPayables = sampleWithRequiredData;
        expectedResult = service.addAccountPayablesToCollectionIfMissing([], null, accountPayables, undefined);
        expect(expectedResult).toEqual([accountPayables]);
      });

      it('should return initial array if no AccountPayables is added', () => {
        const accountPayablesCollection: IAccountPayables[] = [sampleWithRequiredData];
        expectedResult = service.addAccountPayablesToCollectionIfMissing(accountPayablesCollection, undefined, null);
        expect(expectedResult).toEqual(accountPayablesCollection);
      });
    });

    describe('compareAccountPayables', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAccountPayables(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 21189 };
        const entity2 = null;

        const compareResult1 = service.compareAccountPayables(entity1, entity2);
        const compareResult2 = service.compareAccountPayables(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 21189 };
        const entity2 = { id: 1994 };

        const compareResult1 = service.compareAccountPayables(entity1, entity2);
        const compareResult2 = service.compareAccountPayables(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 21189 };
        const entity2 = { id: 21189 };

        const compareResult1 = service.compareAccountPayables(entity1, entity2);
        const compareResult2 = service.compareAccountPayables(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
