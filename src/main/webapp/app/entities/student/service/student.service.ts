import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IStudent, NewStudent } from '../student.model';

export type PartialUpdateStudent = Partial<IStudent> & Pick<IStudent, 'id'>;

type RestOf<T extends IStudent | NewStudent> = Omit<T, 'birthDate' | 'createdDate' | 'lastModifiedDate'> & {
  birthDate?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestStudent = RestOf<IStudent>;

export type NewRestStudent = RestOf<NewStudent>;

export type PartialUpdateRestStudent = RestOf<PartialUpdateStudent>;

@Injectable()
export class StudentsService {
  readonly studentsParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly studentsResource = httpResource<RestStudent[]>(() => {
    const params = this.studentsParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of student that have been fetched. It is updated when the studentsResource emits a new value.
   * In case of error while fetching the students, the signal is set to an empty array.
   */
  readonly students = computed(() =>
    (this.studentsResource.hasValue() ? this.studentsResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/students');

  protected convertValueFromServer(restStudent: RestStudent): IStudent {
    return {
      ...restStudent,
      birthDate: restStudent.birthDate ? dayjs(restStudent.birthDate) : undefined,
      createdDate: restStudent.createdDate ? dayjs(restStudent.createdDate) : undefined,
      lastModifiedDate: restStudent.lastModifiedDate ? dayjs(restStudent.lastModifiedDate) : undefined,
    };
  }
}

@Injectable({ providedIn: 'root' })
export class StudentService extends StudentsService {
  protected readonly http = inject(HttpClient);

  create(student: NewStudent): Observable<IStudent> {
    const copy = this.convertValueFromClient(student);
    return this.http.post<RestStudent>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(student: IStudent): Observable<IStudent> {
    const copy = this.convertValueFromClient(student);
    return this.http
      .put<RestStudent>(`${this.resourceUrl}/${encodeURIComponent(this.getStudentIdentifier(student))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(student: PartialUpdateStudent): Observable<IStudent> {
    const copy = this.convertValueFromClient(student);
    return this.http
      .patch<RestStudent>(`${this.resourceUrl}/${encodeURIComponent(this.getStudentIdentifier(student))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<IStudent> {
    return this.http
      .get<RestStudent>(`${this.resourceUrl}/${encodeURIComponent(id)}`)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<IStudent[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestStudent[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getStudentIdentifier(student: Pick<IStudent, 'id'>): number {
    return student.id;
  }

  compareStudent(o1: Pick<IStudent, 'id'> | null, o2: Pick<IStudent, 'id'> | null): boolean {
    return o1 && o2 ? this.getStudentIdentifier(o1) === this.getStudentIdentifier(o2) : o1 === o2;
  }

  addStudentToCollectionIfMissing<Type extends Pick<IStudent, 'id'>>(
    studentCollection: Type[],
    ...studentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const students: Type[] = studentsToCheck.filter(isPresent);
    if (students.length > 0) {
      const studentCollectionIdentifiers = studentCollection.map(studentItem => this.getStudentIdentifier(studentItem));
      const studentsToAdd = students.filter(studentItem => {
        const studentIdentifier = this.getStudentIdentifier(studentItem);
        if (studentCollectionIdentifiers.includes(studentIdentifier)) {
          return false;
        }
        studentCollectionIdentifiers.push(studentIdentifier);
        return true;
      });
      return [...studentsToAdd, ...studentCollection];
    }
    return studentCollection;
  }

  protected convertValueFromClient<T extends IStudent | NewStudent | PartialUpdateStudent>(student: T): RestOf<T> {
    return {
      ...student,
      birthDate: student.birthDate?.toJSON() ?? null,
      createdDate: student.createdDate?.toJSON() ?? null,
      lastModifiedDate: student.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertResponseFromServer(res: RestStudent): IStudent {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestStudent[]): IStudent[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
