import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICourse, NewCourse } from '../course.model';

export type PartialUpdateCourse = Partial<ICourse> & Pick<ICourse, 'id'>;

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
    return this.http.post<ICourse>(this.resourceUrl, course, { observe: 'response' });
  }

  update(course: ICourse): Observable<EntityResponseType> {
    return this.http.put<ICourse>(`${this.resourceUrl}/${this.getCourseIdentifier(course)}`, course, { observe: 'response' });
  }

  partialUpdate(course: PartialUpdateCourse): Observable<EntityResponseType> {
    return this.http.patch<ICourse>(`${this.resourceUrl}/${this.getCourseIdentifier(course)}`, course, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICourse>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICourse[]>(this.resourceUrl, { params: options, observe: 'response' });
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
}
