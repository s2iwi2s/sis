import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IOrg } from '../org.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../org.test-samples';

import { OrgService } from './org.service';

const requireRestSample: IOrg = {
  ...sampleWithRequiredData,
};

describe('Org Service', () => {
  let service: OrgService;
  let httpMock: HttpTestingController;
  let expectedResult: IOrg | IOrg[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OrgService);
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

    it('should create a Org', () => {
      const org = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(org).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Org', () => {
      const org = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(org).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Org', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Org', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Org', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addOrgToCollectionIfMissing', () => {
      it('should add a Org to an empty array', () => {
        const org: IOrg = sampleWithRequiredData;
        expectedResult = service.addOrgToCollectionIfMissing([], org);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(org);
      });

      it('should not add a Org to an array that contains it', () => {
        const org: IOrg = sampleWithRequiredData;
        const orgCollection: IOrg[] = [
          {
            ...org,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addOrgToCollectionIfMissing(orgCollection, org);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Org to an array that doesn't contain it", () => {
        const org: IOrg = sampleWithRequiredData;
        const orgCollection: IOrg[] = [sampleWithPartialData];
        expectedResult = service.addOrgToCollectionIfMissing(orgCollection, org);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(org);
      });

      it('should add only unique Org to an array', () => {
        const orgArray: IOrg[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const orgCollection: IOrg[] = [sampleWithRequiredData];
        expectedResult = service.addOrgToCollectionIfMissing(orgCollection, ...orgArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const org: IOrg = sampleWithRequiredData;
        const org2: IOrg = sampleWithPartialData;
        expectedResult = service.addOrgToCollectionIfMissing([], org, org2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(org);
        expect(expectedResult).toContain(org2);
      });

      it('should accept null and undefined values', () => {
        const org: IOrg = sampleWithRequiredData;
        expectedResult = service.addOrgToCollectionIfMissing([], null, org, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(org);
      });

      it('should return initial array if no Org is added', () => {
        const orgCollection: IOrg[] = [sampleWithRequiredData];
        expectedResult = service.addOrgToCollectionIfMissing(orgCollection, undefined, null);
        expect(expectedResult).toEqual(orgCollection);
      });
    });

    describe('compareOrg', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareOrg(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareOrg(entity1, entity2);
        const compareResult2 = service.compareOrg(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareOrg(entity1, entity2);
        const compareResult2 = service.compareOrg(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareOrg(entity1, entity2);
        const compareResult2 = service.compareOrg(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
