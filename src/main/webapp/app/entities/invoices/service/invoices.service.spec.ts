import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IInvoices } from '../invoices.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../invoices.test-samples';

import { InvoicesService, RestInvoices } from './invoices.service';

const requireRestSample: RestInvoices = {
  ...sampleWithRequiredData,
  dueDate: sampleWithRequiredData.dueDate?.format(DATE_FORMAT),
  createdDate: sampleWithRequiredData.createdDate?.format(DATE_FORMAT),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.format(DATE_FORMAT),
};

describe('Invoices Service', () => {
  let service: InvoicesService;
  let httpMock: HttpTestingController;
  let expectedResult: IInvoices | IInvoices[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(InvoicesService);
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

    it('should create a Invoices', () => {
      const invoices = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(invoices).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Invoices', () => {
      const invoices = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(invoices).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Invoices', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Invoices', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Invoices', () => {
      service.delete(123).subscribe();

      const requests = httpMock.match({ method: 'DELETE' });
      expect(requests.length).toBe(1);
    });

    describe('addInvoicesToCollectionIfMissing', () => {
      it('should add a Invoices to an empty array', () => {
        const invoices: IInvoices = sampleWithRequiredData;
        expectedResult = service.addInvoicesToCollectionIfMissing([], invoices);
        expect(expectedResult).toEqual([invoices]);
      });

      it('should not add a Invoices to an array that contains it', () => {
        const invoices: IInvoices = sampleWithRequiredData;
        const invoicesCollection: IInvoices[] = [
          {
            ...invoices,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addInvoicesToCollectionIfMissing(invoicesCollection, invoices);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Invoices to an array that doesn't contain it", () => {
        const invoices: IInvoices = sampleWithRequiredData;
        const invoicesCollection: IInvoices[] = [sampleWithPartialData];
        expectedResult = service.addInvoicesToCollectionIfMissing(invoicesCollection, invoices);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(invoices);
      });

      it('should add only unique Invoices to an array', () => {
        const invoicesArray: IInvoices[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const invoicesCollection: IInvoices[] = [sampleWithRequiredData];
        expectedResult = service.addInvoicesToCollectionIfMissing(invoicesCollection, ...invoicesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const invoices: IInvoices = sampleWithRequiredData;
        const invoices2: IInvoices = sampleWithPartialData;
        expectedResult = service.addInvoicesToCollectionIfMissing([], invoices, invoices2);
        expect(expectedResult).toEqual([invoices, invoices2]);
      });

      it('should accept null and undefined values', () => {
        const invoices: IInvoices = sampleWithRequiredData;
        expectedResult = service.addInvoicesToCollectionIfMissing([], null, invoices, undefined);
        expect(expectedResult).toEqual([invoices]);
      });

      it('should return initial array if no Invoices is added', () => {
        const invoicesCollection: IInvoices[] = [sampleWithRequiredData];
        expectedResult = service.addInvoicesToCollectionIfMissing(invoicesCollection, undefined, null);
        expect(expectedResult).toEqual(invoicesCollection);
      });
    });

    describe('compareInvoices', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareInvoices(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 19997 };
        const entity2 = null;

        const compareResult1 = service.compareInvoices(entity1, entity2);
        const compareResult2 = service.compareInvoices(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 19997 };
        const entity2 = { id: 12072 };

        const compareResult1 = service.compareInvoices(entity1, entity2);
        const compareResult2 = service.compareInvoices(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 19997 };
        const entity2 = { id: 19997 };

        const compareResult1 = service.compareInvoices(entity1, entity2);
        const compareResult2 = service.compareInvoices(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
