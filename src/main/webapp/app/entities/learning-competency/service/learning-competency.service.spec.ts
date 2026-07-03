import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ILearningCompetency } from '../learning-competency.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../learning-competency.test-samples';

import { LearningCompetencyService, RestLearningCompetency } from './learning-competency.service';

const requireRestSample: RestLearningCompetency = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('LearningCompetency Service', () => {
  let service: LearningCompetencyService;
  let httpMock: HttpTestingController;
  let expectedResult: ILearningCompetency | ILearningCompetency[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(LearningCompetencyService);
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

    it('should create a LearningCompetency', () => {
      const learningCompetency = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(learningCompetency).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a LearningCompetency', () => {
      const learningCompetency = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(learningCompetency).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a LearningCompetency', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of LearningCompetency', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a LearningCompetency', () => {
      service.delete(123).subscribe();

      const requests = httpMock.match({ method: 'DELETE' });
      expect(requests.length).toBe(1);
    });

    describe('addLearningCompetencyToCollectionIfMissing', () => {
      it('should add a LearningCompetency to an empty array', () => {
        const learningCompetency: ILearningCompetency = sampleWithRequiredData;
        expectedResult = service.addLearningCompetencyToCollectionIfMissing([], learningCompetency);
        expect(expectedResult).toEqual([learningCompetency]);
      });

      it('should not add a LearningCompetency to an array that contains it', () => {
        const learningCompetency: ILearningCompetency = sampleWithRequiredData;
        const learningCompetencyCollection: ILearningCompetency[] = [
          {
            ...learningCompetency,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addLearningCompetencyToCollectionIfMissing(learningCompetencyCollection, learningCompetency);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a LearningCompetency to an array that doesn't contain it", () => {
        const learningCompetency: ILearningCompetency = sampleWithRequiredData;
        const learningCompetencyCollection: ILearningCompetency[] = [sampleWithPartialData];
        expectedResult = service.addLearningCompetencyToCollectionIfMissing(learningCompetencyCollection, learningCompetency);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(learningCompetency);
      });

      it('should add only unique LearningCompetency to an array', () => {
        const learningCompetencyArray: ILearningCompetency[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const learningCompetencyCollection: ILearningCompetency[] = [sampleWithRequiredData];
        expectedResult = service.addLearningCompetencyToCollectionIfMissing(learningCompetencyCollection, ...learningCompetencyArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const learningCompetency: ILearningCompetency = sampleWithRequiredData;
        const learningCompetency2: ILearningCompetency = sampleWithPartialData;
        expectedResult = service.addLearningCompetencyToCollectionIfMissing([], learningCompetency, learningCompetency2);
        expect(expectedResult).toEqual([learningCompetency, learningCompetency2]);
      });

      it('should accept null and undefined values', () => {
        const learningCompetency: ILearningCompetency = sampleWithRequiredData;
        expectedResult = service.addLearningCompetencyToCollectionIfMissing([], null, learningCompetency, undefined);
        expect(expectedResult).toEqual([learningCompetency]);
      });

      it('should return initial array if no LearningCompetency is added', () => {
        const learningCompetencyCollection: ILearningCompetency[] = [sampleWithRequiredData];
        expectedResult = service.addLearningCompetencyToCollectionIfMissing(learningCompetencyCollection, undefined, null);
        expect(expectedResult).toEqual(learningCompetencyCollection);
      });
    });

    describe('compareLearningCompetency', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareLearningCompetency(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 10670 };
        const entity2 = null;

        const compareResult1 = service.compareLearningCompetency(entity1, entity2);
        const compareResult2 = service.compareLearningCompetency(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 10670 };
        const entity2 = { id: 20625 };

        const compareResult1 = service.compareLearningCompetency(entity1, entity2);
        const compareResult2 = service.compareLearningCompetency(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 10670 };
        const entity2 = { id: 10670 };

        const compareResult1 = service.compareLearningCompetency(entity1, entity2);
        const compareResult2 = service.compareLearningCompetency(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
