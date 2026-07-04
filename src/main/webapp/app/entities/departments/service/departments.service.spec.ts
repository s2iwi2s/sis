import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { IDepartments } from '../departments.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../departments.test-samples';

import { DepartmentsService, RestDepartments } from './departments.service';

const requireRestSample: RestDepartments = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('Departments Service', () => {
  let service: DepartmentsService;
  let httpMock: HttpTestingController;
  let expectedResult: IDepartments | IDepartments[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(DepartmentsService);
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

    it('should create a Departments', () => {
      const departments = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(departments).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Departments', () => {
      const departments = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(departments).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Departments', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Departments', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Departments', () => {
      service.delete(123).subscribe();

      const requests = httpMock.match({ method: 'DELETE' });
      expect(requests.length).toBe(1);
    });

    describe('addDepartmentsToCollectionIfMissing', () => {
      it('should add a Departments to an empty array', () => {
        const departments: IDepartments = sampleWithRequiredData;
        expectedResult = service.addDepartmentsToCollectionIfMissing([], departments);
        expect(expectedResult).toEqual([departments]);
      });

      it('should not add a Departments to an array that contains it', () => {
        const departments: IDepartments = sampleWithRequiredData;
        const departmentsCollection: IDepartments[] = [
          {
            ...departments,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDepartmentsToCollectionIfMissing(departmentsCollection, departments);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Departments to an array that doesn't contain it", () => {
        const departments: IDepartments = sampleWithRequiredData;
        const departmentsCollection: IDepartments[] = [sampleWithPartialData];
        expectedResult = service.addDepartmentsToCollectionIfMissing(departmentsCollection, departments);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(departments);
      });

      it('should add only unique Departments to an array', () => {
        const departmentsArray: IDepartments[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const departmentsCollection: IDepartments[] = [sampleWithRequiredData];
        expectedResult = service.addDepartmentsToCollectionIfMissing(departmentsCollection, ...departmentsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const departments: IDepartments = sampleWithRequiredData;
        const departments2: IDepartments = sampleWithPartialData;
        expectedResult = service.addDepartmentsToCollectionIfMissing([], departments, departments2);
        expect(expectedResult).toEqual([departments, departments2]);
      });

      it('should accept null and undefined values', () => {
        const departments: IDepartments = sampleWithRequiredData;
        expectedResult = service.addDepartmentsToCollectionIfMissing([], null, departments, undefined);
        expect(expectedResult).toEqual([departments]);
      });

      it('should return initial array if no Departments is added', () => {
        const departmentsCollection: IDepartments[] = [sampleWithRequiredData];
        expectedResult = service.addDepartmentsToCollectionIfMissing(departmentsCollection, undefined, null);
        expect(expectedResult).toEqual(departmentsCollection);
      });
    });

    describe('compareDepartments', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDepartments(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 27308 };
        const entity2 = null;

        const compareResult1 = service.compareDepartments(entity1, entity2);
        const compareResult2 = service.compareDepartments(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 27308 };
        const entity2 = { id: 8098 };

        const compareResult1 = service.compareDepartments(entity1, entity2);
        const compareResult2 = service.compareDepartments(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 27308 };
        const entity2 = { id: 27308 };

        const compareResult1 = service.compareDepartments(entity1, entity2);
        const compareResult2 = service.compareDepartments(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
