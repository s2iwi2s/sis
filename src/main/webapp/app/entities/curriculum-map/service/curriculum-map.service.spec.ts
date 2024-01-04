import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICurriculumMap } from '../curriculum-map.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../curriculum-map.test-samples';

import { CurriculumMapService } from './curriculum-map.service';

const requireRestSample: ICurriculumMap = {
  ...sampleWithRequiredData,
};

describe('CurriculumMap Service', () => {
  let service: CurriculumMapService;
  let httpMock: HttpTestingController;
  let expectedResult: ICurriculumMap | ICurriculumMap[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CurriculumMapService);
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

    it('should create a CurriculumMap', () => {
      const curriculumMap = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(curriculumMap).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CurriculumMap', () => {
      const curriculumMap = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(curriculumMap).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CurriculumMap', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CurriculumMap', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CurriculumMap', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCurriculumMapToCollectionIfMissing', () => {
      it('should add a CurriculumMap to an empty array', () => {
        const curriculumMap: ICurriculumMap = sampleWithRequiredData;
        expectedResult = service.addCurriculumMapToCollectionIfMissing([], curriculumMap);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(curriculumMap);
      });

      it('should not add a CurriculumMap to an array that contains it', () => {
        const curriculumMap: ICurriculumMap = sampleWithRequiredData;
        const curriculumMapCollection: ICurriculumMap[] = [
          {
            ...curriculumMap,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCurriculumMapToCollectionIfMissing(curriculumMapCollection, curriculumMap);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CurriculumMap to an array that doesn't contain it", () => {
        const curriculumMap: ICurriculumMap = sampleWithRequiredData;
        const curriculumMapCollection: ICurriculumMap[] = [sampleWithPartialData];
        expectedResult = service.addCurriculumMapToCollectionIfMissing(curriculumMapCollection, curriculumMap);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(curriculumMap);
      });

      it('should add only unique CurriculumMap to an array', () => {
        const curriculumMapArray: ICurriculumMap[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const curriculumMapCollection: ICurriculumMap[] = [sampleWithRequiredData];
        expectedResult = service.addCurriculumMapToCollectionIfMissing(curriculumMapCollection, ...curriculumMapArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const curriculumMap: ICurriculumMap = sampleWithRequiredData;
        const curriculumMap2: ICurriculumMap = sampleWithPartialData;
        expectedResult = service.addCurriculumMapToCollectionIfMissing([], curriculumMap, curriculumMap2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(curriculumMap);
        expect(expectedResult).toContain(curriculumMap2);
      });

      it('should accept null and undefined values', () => {
        const curriculumMap: ICurriculumMap = sampleWithRequiredData;
        expectedResult = service.addCurriculumMapToCollectionIfMissing([], null, curriculumMap, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(curriculumMap);
      });

      it('should return initial array if no CurriculumMap is added', () => {
        const curriculumMapCollection: ICurriculumMap[] = [sampleWithRequiredData];
        expectedResult = service.addCurriculumMapToCollectionIfMissing(curriculumMapCollection, undefined, null);
        expect(expectedResult).toEqual(curriculumMapCollection);
      });
    });

    describe('compareCurriculumMap', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCurriculumMap(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCurriculumMap(entity1, entity2);
        const compareResult2 = service.compareCurriculumMap(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCurriculumMap(entity1, entity2);
        const compareResult2 = service.compareCurriculumMap(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCurriculumMap(entity1, entity2);
        const compareResult2 = service.compareCurriculumMap(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
