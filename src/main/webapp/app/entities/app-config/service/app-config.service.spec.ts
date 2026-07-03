import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { IAppConfig } from '../app-config.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../app-config.test-samples';

import { AppConfigService, RestAppConfig } from './app-config.service';

const requireRestSample: RestAppConfig = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('AppConfig Service', () => {
  let service: AppConfigService;
  let httpMock: HttpTestingController;
  let expectedResult: IAppConfig | IAppConfig[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(AppConfigService);
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

    it('should create a AppConfig', () => {
      const appConfig = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(appConfig).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AppConfig', () => {
      const appConfig = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(appConfig).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AppConfig', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AppConfig', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a AppConfig', () => {
      service.delete(123).subscribe();

      const requests = httpMock.match({ method: 'DELETE' });
      expect(requests.length).toBe(1);
    });

    describe('addAppConfigToCollectionIfMissing', () => {
      it('should add a AppConfig to an empty array', () => {
        const appConfig: IAppConfig = sampleWithRequiredData;
        expectedResult = service.addAppConfigToCollectionIfMissing([], appConfig);
        expect(expectedResult).toEqual([appConfig]);
      });

      it('should not add a AppConfig to an array that contains it', () => {
        const appConfig: IAppConfig = sampleWithRequiredData;
        const appConfigCollection: IAppConfig[] = [
          {
            ...appConfig,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAppConfigToCollectionIfMissing(appConfigCollection, appConfig);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AppConfig to an array that doesn't contain it", () => {
        const appConfig: IAppConfig = sampleWithRequiredData;
        const appConfigCollection: IAppConfig[] = [sampleWithPartialData];
        expectedResult = service.addAppConfigToCollectionIfMissing(appConfigCollection, appConfig);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(appConfig);
      });

      it('should add only unique AppConfig to an array', () => {
        const appConfigArray: IAppConfig[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const appConfigCollection: IAppConfig[] = [sampleWithRequiredData];
        expectedResult = service.addAppConfigToCollectionIfMissing(appConfigCollection, ...appConfigArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const appConfig: IAppConfig = sampleWithRequiredData;
        const appConfig2: IAppConfig = sampleWithPartialData;
        expectedResult = service.addAppConfigToCollectionIfMissing([], appConfig, appConfig2);
        expect(expectedResult).toEqual([appConfig, appConfig2]);
      });

      it('should accept null and undefined values', () => {
        const appConfig: IAppConfig = sampleWithRequiredData;
        expectedResult = service.addAppConfigToCollectionIfMissing([], null, appConfig, undefined);
        expect(expectedResult).toEqual([appConfig]);
      });

      it('should return initial array if no AppConfig is added', () => {
        const appConfigCollection: IAppConfig[] = [sampleWithRequiredData];
        expectedResult = service.addAppConfigToCollectionIfMissing(appConfigCollection, undefined, null);
        expect(expectedResult).toEqual(appConfigCollection);
      });
    });

    describe('compareAppConfig', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAppConfig(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 10896 };
        const entity2 = null;

        const compareResult1 = service.compareAppConfig(entity1, entity2);
        const compareResult2 = service.compareAppConfig(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 10896 };
        const entity2 = { id: 7808 };

        const compareResult1 = service.compareAppConfig(entity1, entity2);
        const compareResult2 = service.compareAppConfig(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 10896 };
        const entity2 = { id: 10896 };

        const compareResult1 = service.compareAppConfig(entity1, entity2);
        const compareResult2 = service.compareAppConfig(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
