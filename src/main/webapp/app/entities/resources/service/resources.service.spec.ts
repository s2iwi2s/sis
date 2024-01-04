import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IResources } from '../resources.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../resources.test-samples';

import { ResourcesService } from './resources.service';

const requireRestSample: IResources = {
  ...sampleWithRequiredData,
};

describe('Resources Service', () => {
  let service: ResourcesService;
  let httpMock: HttpTestingController;
  let expectedResult: IResources | IResources[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ResourcesService);
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

    it('should create a Resources', () => {
      const resources = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(resources).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Resources', () => {
      const resources = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(resources).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Resources', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

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
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addResourcesToCollectionIfMissing', () => {
      it('should add a Resources to an empty array', () => {
        const resources: IResources = sampleWithRequiredData;
        expectedResult = service.addResourcesToCollectionIfMissing([], resources);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(resources);
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
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(resources);
        expect(expectedResult).toContain(resources2);
      });

      it('should accept null and undefined values', () => {
        const resources: IResources = sampleWithRequiredData;
        expectedResult = service.addResourcesToCollectionIfMissing([], null, resources, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(resources);
      });

      it('should return initial array if no Resources is added', () => {
        const resourcesCollection: IResources[] = [sampleWithRequiredData];
        expectedResult = service.addResourcesToCollectionIfMissing(resourcesCollection, undefined, null);
        expect(expectedResult).toEqual(resourcesCollection);
      });
    });

    describe('compareResources', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareResources(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareResources(entity1, entity2);
        const compareResult2 = service.compareResources(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareResources(entity1, entity2);
        const compareResult2 = service.compareResources(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

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
