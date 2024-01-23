import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IInstructor } from '../instructor.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../instructor.test-samples';

import { InstructorService, RestInstructor } from './instructor.service';

const requireRestSample: RestInstructor = {
  ...sampleWithRequiredData,
  hireDate: sampleWithRequiredData.hireDate?.toJSON(),
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('Instructor Service', () => {
  let service: InstructorService;
  let httpMock: HttpTestingController;
  let expectedResult: IInstructor | IInstructor[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(InstructorService);
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

    it('should create a Instructor', () => {
      const instructor = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(instructor).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Instructor', () => {
      const instructor = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(instructor).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Instructor', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Instructor', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Instructor', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addInstructorToCollectionIfMissing', () => {
      it('should add a Instructor to an empty array', () => {
        const instructor: IInstructor = sampleWithRequiredData;
        expectedResult = service.addInstructorToCollectionIfMissing([], instructor);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(instructor);
      });

      it('should not add a Instructor to an array that contains it', () => {
        const instructor: IInstructor = sampleWithRequiredData;
        const instructorCollection: IInstructor[] = [
          {
            ...instructor,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addInstructorToCollectionIfMissing(instructorCollection, instructor);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Instructor to an array that doesn't contain it", () => {
        const instructor: IInstructor = sampleWithRequiredData;
        const instructorCollection: IInstructor[] = [sampleWithPartialData];
        expectedResult = service.addInstructorToCollectionIfMissing(instructorCollection, instructor);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(instructor);
      });

      it('should add only unique Instructor to an array', () => {
        const instructorArray: IInstructor[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const instructorCollection: IInstructor[] = [sampleWithRequiredData];
        expectedResult = service.addInstructorToCollectionIfMissing(instructorCollection, ...instructorArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const instructor: IInstructor = sampleWithRequiredData;
        const instructor2: IInstructor = sampleWithPartialData;
        expectedResult = service.addInstructorToCollectionIfMissing([], instructor, instructor2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(instructor);
        expect(expectedResult).toContain(instructor2);
      });

      it('should accept null and undefined values', () => {
        const instructor: IInstructor = sampleWithRequiredData;
        expectedResult = service.addInstructorToCollectionIfMissing([], null, instructor, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(instructor);
      });

      it('should return initial array if no Instructor is added', () => {
        const instructorCollection: IInstructor[] = [sampleWithRequiredData];
        expectedResult = service.addInstructorToCollectionIfMissing(instructorCollection, undefined, null);
        expect(expectedResult).toEqual(instructorCollection);
      });
    });

    describe('compareInstructor', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareInstructor(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareInstructor(entity1, entity2);
        const compareResult2 = service.compareInstructor(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareInstructor(entity1, entity2);
        const compareResult2 = service.compareInstructor(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareInstructor(entity1, entity2);
        const compareResult2 = service.compareInstructor(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
