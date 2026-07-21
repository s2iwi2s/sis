import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { ICourse, NewCourse } from '../course.model';

export type PartialUpdateCourse = Partial<ICourse> & Pick<ICourse, 'id'>;

type RestOf<T extends ICourse | NewCourse> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestCourse = RestOf<ICourse>;

export type NewRestCourse = RestOf<NewCourse>;

export type PartialUpdateRestCourse = RestOf<PartialUpdateCourse>;

@Injectable()
export class CoursesService {
  readonly coursesParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly coursesResource = httpResource<RestCourse[]>(() => {
    const params = this.coursesParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of course that have been fetched. It is updated when the coursesResource emits a new value.
   * In case of error while fetching the courses, the signal is set to an empty array.
   */
  readonly courses = computed(() =>
    (this.coursesResource.hasValue() ? this.coursesResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/courses');

  protected convertValueFromServer(restCourse: RestCourse): ICourse {
    return {
      ...restCourse,
      createdDate: restCourse.createdDate ? dayjs(restCourse.createdDate) : undefined,
      lastModifiedDate: restCourse.lastModifiedDate ? dayjs(restCourse.lastModifiedDate) : undefined,
    };
  }
}

@Injectable({ providedIn: 'root' })
export class CourseService extends CoursesService {
  protected readonly http = inject(HttpClient);

  create(course: NewCourse): Observable<ICourse> {
    const copy = this.convertValueFromClient(course);
    return this.http.post<RestCourse>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(course: ICourse): Observable<ICourse> {
    const copy = this.convertValueFromClient(course);
    return this.http
      .put<RestCourse>(`${this.resourceUrl}/${encodeURIComponent(this.getCourseIdentifier(course))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(course: PartialUpdateCourse): Observable<ICourse> {
    const copy = this.convertValueFromClient(course);
    return this.http
      .patch<RestCourse>(`${this.resourceUrl}/${encodeURIComponent(this.getCourseIdentifier(course))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<ICourse> {
    return this.http.get<RestCourse>(`${this.resourceUrl}/${encodeURIComponent(id)}`).pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<ICourse[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCourse[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
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
      const courseCollectionIdentifiers = courseCollection.map(courseItem => this.getCourseIdentifier(courseItem));
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

  sortCourse(items: ICourse[]): ICourse[] {
    const optionsCopy = [...items];
    return optionsCopy.sort(
      (a, b) => (b.subject ?? '').localeCompare(a.subject ?? '') || (b.year?.name ?? '').localeCompare(a.year?.name ?? ''),
    );
  }

  protected convertValueFromClient<T extends ICourse | NewCourse | PartialUpdateCourse>(course: T): RestOf<T> {
    return {
      ...course,
      createdDate: course.createdDate?.toJSON() ?? null,
      lastModifiedDate: course.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertResponseFromServer(res: RestCourse): ICourse {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestCourse[]): ICourse[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
