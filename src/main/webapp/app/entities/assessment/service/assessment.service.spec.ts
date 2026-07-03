import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { IAssessment } from '../assessment.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../assessment.test-samples';

import { AssessmentService, RestAssessment } from './assessment.service';

const requireRestSample: RestAssessment = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('Assessment Service', () => {
  let service: AssessmentService;
  let httpMock: HttpTestingController;
  let expectedResult: IAssessment | IAssessment[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(AssessmentService);
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

    it('should create a Assessment', () => {
      const assessment = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(assessment).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Assessment', () => {
      const assessment = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(assessment).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Assessment', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Assessment', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Assessment', () => {
      service.delete(123).subscribe();

      const requests = httpMock.match({ method: 'DELETE' });
      expect(requests.length).toBe(1);
    });

    describe('addAssessmentToCollectionIfMissing', () => {
      it('should add a Assessment to an empty array', () => {
        const assessment: IAssessment = sampleWithRequiredData;
        expectedResult = service.addAssessmentToCollectionIfMissing([], assessment);
        expect(expectedResult).toEqual([assessment]);
      });

      it('should not add a Assessment to an array that contains it', () => {
        const assessment: IAssessment = sampleWithRequiredData;
        const assessmentCollection: IAssessment[] = [
          {
            ...assessment,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAssessmentToCollectionIfMissing(assessmentCollection, assessment);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Assessment to an array that doesn't contain it", () => {
        const assessment: IAssessment = sampleWithRequiredData;
        const assessmentCollection: IAssessment[] = [sampleWithPartialData];
        expectedResult = service.addAssessmentToCollectionIfMissing(assessmentCollection, assessment);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(assessment);
      });

      it('should add only unique Assessment to an array', () => {
        const assessmentArray: IAssessment[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const assessmentCollection: IAssessment[] = [sampleWithRequiredData];
        expectedResult = service.addAssessmentToCollectionIfMissing(assessmentCollection, ...assessmentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const assessment: IAssessment = sampleWithRequiredData;
        const assessment2: IAssessment = sampleWithPartialData;
        expectedResult = service.addAssessmentToCollectionIfMissing([], assessment, assessment2);
        expect(expectedResult).toEqual([assessment, assessment2]);
      });

      it('should accept null and undefined values', () => {
        const assessment: IAssessment = sampleWithRequiredData;
        expectedResult = service.addAssessmentToCollectionIfMissing([], null, assessment, undefined);
        expect(expectedResult).toEqual([assessment]);
      });

      it('should return initial array if no Assessment is added', () => {
        const assessmentCollection: IAssessment[] = [sampleWithRequiredData];
        expectedResult = service.addAssessmentToCollectionIfMissing(assessmentCollection, undefined, null);
        expect(expectedResult).toEqual(assessmentCollection);
      });
    });

    describe('compareAssessment', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAssessment(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 23530 };
        const entity2 = null;

        const compareResult1 = service.compareAssessment(entity1, entity2);
        const compareResult2 = service.compareAssessment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 23530 };
        const entity2 = { id: 23810 };

        const compareResult1 = service.compareAssessment(entity1, entity2);
        const compareResult2 = service.compareAssessment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 23530 };
        const entity2 = { id: 23530 };

        const compareResult1 = service.compareAssessment(entity1, entity2);
        const compareResult2 = service.compareAssessment(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
