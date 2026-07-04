import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { IStudent } from '../student.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../student.test-samples';

import { RestStudent, StudentService } from './student.service';

const requireRestSample: RestStudent = {
  ...sampleWithRequiredData,
  birthDate: sampleWithRequiredData.birthDate?.toJSON(),
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('Student Service', () => {
  let service: StudentService;
  let httpMock: HttpTestingController;
  let expectedResult: IStudent | IStudent[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(StudentService);
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

    it('should create a Student', () => {
      const student = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(student).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Student', () => {
      const student = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(student).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Student', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Student', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Student', () => {
      service.delete(123).subscribe();

      const requests = httpMock.match({ method: 'DELETE' });
      expect(requests.length).toBe(1);
    });

    describe('addStudentToCollectionIfMissing', () => {
      it('should add a Student to an empty array', () => {
        const student: IStudent = sampleWithRequiredData;
        expectedResult = service.addStudentToCollectionIfMissing([], student);
        expect(expectedResult).toEqual([student]);
      });

      it('should not add a Student to an array that contains it', () => {
        const student: IStudent = sampleWithRequiredData;
        const studentCollection: IStudent[] = [
          {
            ...student,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addStudentToCollectionIfMissing(studentCollection, student);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Student to an array that doesn't contain it", () => {
        const student: IStudent = sampleWithRequiredData;
        const studentCollection: IStudent[] = [sampleWithPartialData];
        expectedResult = service.addStudentToCollectionIfMissing(studentCollection, student);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(student);
      });

      it('should add only unique Student to an array', () => {
        const studentArray: IStudent[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const studentCollection: IStudent[] = [sampleWithRequiredData];
        expectedResult = service.addStudentToCollectionIfMissing(studentCollection, ...studentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const student: IStudent = sampleWithRequiredData;
        const student2: IStudent = sampleWithPartialData;
        expectedResult = service.addStudentToCollectionIfMissing([], student, student2);
        expect(expectedResult).toEqual([student, student2]);
      });

      it('should accept null and undefined values', () => {
        const student: IStudent = sampleWithRequiredData;
        expectedResult = service.addStudentToCollectionIfMissing([], null, student, undefined);
        expect(expectedResult).toEqual([student]);
      });

      it('should return initial array if no Student is added', () => {
        const studentCollection: IStudent[] = [sampleWithRequiredData];
        expectedResult = service.addStudentToCollectionIfMissing(studentCollection, undefined, null);
        expect(expectedResult).toEqual(studentCollection);
      });
    });

    describe('compareStudent', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareStudent(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 9978 };
        const entity2 = null;

        const compareResult1 = service.compareStudent(entity1, entity2);
        const compareResult2 = service.compareStudent(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 9978 };
        const entity2 = { id: 22718 };

        const compareResult1 = service.compareStudent(entity1, entity2);
        const compareResult2 = service.compareStudent(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 9978 };
        const entity2 = { id: 9978 };

        const compareResult1 = service.compareStudent(entity1, entity2);
        const compareResult2 = service.compareStudent(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
