import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICourse, NewCourse } from '../course.model';

export type PartialUpdateCourse = Partial<ICourse> & Pick<ICourse, 'id'>;

type RestOf<T extends ICourse | NewCourse> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestCourse = RestOf<ICourse>;

export type NewRestCourse = RestOf<NewCourse>;

export type PartialUpdateRestCourse = RestOf<PartialUpdateCourse>;

export type EntityResponseType = HttpResponse<ICourse>;
export type EntityArrayResponseType = HttpResponse<ICourse[]>;

@Injectable({ providedIn: 'root' })
export class CourseService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/courses');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(course: NewCourse): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(course);
    return this.http
      .post<RestCourse>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(course: ICourse): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(course);
    return this.http
      .put<RestCourse>(`${this.resourceUrl}/${this.getCourseIdentifier(course)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(course: PartialUpdateCourse): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(course);
    return this.http
      .patch<RestCourse>(`${this.resourceUrl}/${this.getCourseIdentifier(course)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestCourse>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCourse[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCourseIdentifier(course: Pick<ICourse, 'id'>): number {
    return course.id;
  }

  compareCourse(o1: Pick<ICourse, 'id'> | null, o2: Pick<ICourse, 'id'> | null): boolean {
    return o1 && o2 ? this.getCourseIdentifier(o1) === this.getCourseIdentifier(o2) : o1 === o2;
  }

  addCourseToCollectionIfMissing<Type extends Pick<ICourse, 'id'>>(
    courseCollection: Type[],
    ...coursesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const courses: Type[] = coursesToCheck.filter(isPresent);
    if (courses.length > 0) {
      const courseCollectionIdentifiers = courseCollection.map(courseItem => this.getCourseIdentifier(courseItem)!);
      const coursesToAdd = courses.filter(courseItem => {
        const courseIdentifier = this.getCourseIdentifier(courseItem);
        if (courseCollectionIdentifiers.includes(courseIdentifier)) {
          return false;
        }
        courseCollectionIdentifiers.push(courseIdentifier);
        return true;
      });
      return [...coursesToAdd, ...courseCollection];
    }
    return courseCollection;
  }

  protected convertDateFromClient<T extends ICourse | NewCourse | PartialUpdateCourse>(course: T): RestOf<T> {
    return {
      ...course,
      createdDate: course.createdDate?.toJSON() ?? null,
      lastModifiedDate: course.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restCourse: RestCourse): ICourse {
    return {
      ...restCourse,
      createdDate: restCourse.createdDate ? dayjs(restCourse.createdDate) : undefined,
      lastModifiedDate: restCourse.lastModifiedDate ? dayjs(restCourse.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCourse>): HttpResponse<ICourse> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestCourse[]>): HttpResponse<ICourse[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
