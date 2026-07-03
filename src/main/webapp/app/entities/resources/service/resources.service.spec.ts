import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { IResources } from '../resources.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../resources.test-samples';

import { ResourcesService, RestResources } from './resources.service';

const requireRestSample: RestResources = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('Resources Service', () => {
  let service: ResourcesService;
  let httpMock: HttpTestingController;
  let expectedResult: IResources | IResources[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(ResourcesService);
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

    it('should create a Resources', () => {
      const resources = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(resources).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Resources', () => {
      const resources = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(resources).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Resources', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Resources', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Resources', () => {
      service.delete(123).subscribe();

      const requests = httpMock.match({ method: 'DELETE' });
      expect(requests.length).toBe(1);
    });

    describe('addResourcesToCollectionIfMissing', () => {
      it('should add a Resources to an empty array', () => {
        const resources: IResources = sampleWithRequiredData;
        expectedResult = service.addResourcesToCollectionIfMissing([], resources);
        expect(expectedResult).toEqual([resources]);
      });

      it('should not add a Resources to an array that contains it', () => {
        const resources: IResources = sampleWithRequiredData;
        const resourcesCollection: IResources[] = [
          {
            ...resources,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addResourcesToCollectionIfMissing(resourcesCollection, resources);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Resources to an array that doesn't contain it", () => {
        const resources: IResources = sampleWithRequiredData;
        const resourcesCollection: IResources[] = [sampleWithPartialData];
        expectedResult = service.addResourcesToCollectionIfMissing(resourcesCollection, resources);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(resources);
      });

      it('should add only unique Resources to an array', () => {
        const resourcesArray: IResources[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const resourcesCollection: IResources[] = [sampleWithRequiredData];
        expectedResult = service.addResourcesToCollectionIfMissing(resourcesCollection, ...resourcesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const resources: IResources = sampleWithRequiredData;
        const resources2: IResources = sampleWithPartialData;
        expectedResult = service.addResourcesToCollectionIfMissing([], resources, resources2);
        expect(expectedResult).toEqual([resources, resources2]);
      });

      it('should accept null and undefined values', () => {
        const resources: IResources = sampleWithRequiredData;
        expectedResult = service.addResourcesToCollectionIfMissing([], null, resources, undefined);
        expect(expectedResult).toEqual([resources]);
      });

      it('should return initial array if no Resources is added', () => {
        const resourcesCollection: IResources[] = [sampleWithRequiredData];
        expectedResult = service.addResourcesToCollectionIfMissing(resourcesCollection, undefined, null);
        expect(expectedResult).toEqual(resourcesCollection);
      });
    });

    describe('compareResources', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareResources(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 3547 };
        const entity2 = null;

        const compareResult1 = service.compareResources(entity1, entity2);
        const compareResult2 = service.compareResources(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 3547 };
        const entity2 = { id: 4633 };

        const compareResult1 = service.compareResources(entity1, entity2);
        const compareResult2 = service.compareResources(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 3547 };
        const entity2 = { id: 3547 };

        const compareResult1 = service.compareResources(entity1, entity2);
        const compareResult2 = service.compareResources(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
