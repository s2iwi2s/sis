import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAppConfig } from '../app-config.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../app-config.test-samples';

import { AppConfigService } from './app-config.service';

const requireRestSample: IAppConfig = {
  ...sampleWithRequiredData,
};

describe('AppConfig Service', () => {
  let service: AppConfigService;
  let httpMock: HttpTestingController;
  let expectedResult: IAppConfig | IAppConfig[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AppConfigService);
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

    it('should create a AppConfig', () => {
      const appConfig = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(appConfig).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AppConfig', () => {
      const appConfig = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(appConfig).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AppConfig', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

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
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAppConfigToCollectionIfMissing', () => {
      it('should add a AppConfig to an empty array', () => {
        const appConfig: IAppConfig = sampleWithRequiredData;
        expectedResult = service.addAppConfigToCollectionIfMissing([], appConfig);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(appConfig);
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
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(appConfig);
        expect(expectedResult).toContain(appConfig2);
      });

      it('should accept null and undefined values', () => {
        const appConfig: IAppConfig = sampleWithRequiredData;
        expectedResult = service.addAppConfigToCollectionIfMissing([], null, appConfig, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(appConfig);
      });

      it('should return initial array if no AppConfig is added', () => {
        const appConfigCollection: IAppConfig[] = [sampleWithRequiredData];
        expectedResult = service.addAppConfigToCollectionIfMissing(appConfigCollection, undefined, null);
        expect(expectedResult).toEqual(appConfigCollection);
      });
    });

    describe('compareAppConfig', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAppConfig(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAppConfig(entity1, entity2);
        const compareResult2 = service.compareAppConfig(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAppConfig(entity1, entity2);
        const compareResult2 = service.compareAppConfig(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

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
