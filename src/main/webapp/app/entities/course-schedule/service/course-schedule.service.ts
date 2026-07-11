import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { ICourseSchedule, NewCourseSchedule } from '../course-schedule.model';

export type PartialUpdateCourseSchedule = Partial<ICourseSchedule> & Pick<ICourseSchedule, 'id'>;

type RestOf<T extends ICourseSchedule | NewCourseSchedule> = Omit<T, 'startTime' | 'endTime' | 'createdDate' | 'lastModifiedDate'> & {
  startTime?: string | null;
  endTime?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestCourseSchedule = RestOf<ICourseSchedule>;

export type NewRestCourseSchedule = RestOf<NewCourseSchedule>;

export type PartialUpdateRestCourseSchedule = RestOf<PartialUpdateCourseSchedule>;

@Injectable()
export class CourseSchedulesService {
  readonly courseSchedulesParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly courseSchedulesResource = httpResource<RestCourseSchedule[]>(() => {
    const params = this.courseSchedulesParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of courseSchedule that have been fetched. It is updated when the courseSchedulesResource emits a new value.
   * In case of error while fetching the courseSchedules, the signal is set to an empty array.
   */
  readonly courseSchedules = computed(() =>
    (this.courseSchedulesResource.hasValue() ? this.courseSchedulesResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/course-schedules');

  protected convertValueFromServer(restCourseSchedule: RestCourseSchedule): ICourseSchedule {
    return {
      ...restCourseSchedule,
      startTime: restCourseSchedule.startTime ? dayjs(restCourseSchedule.startTime) : undefined,
      endTime: restCourseSchedule.endTime ? dayjs(restCourseSchedule.endTime) : undefined,
      createdDate: restCourseSchedule.createdDate ? dayjs(restCourseSchedule.createdDate) : undefined,
      lastModifiedDate: restCourseSchedule.lastModifiedDate ? dayjs(restCourseSchedule.lastModifiedDate) : undefined,
    };
  }
}

@Injectable({ providedIn: 'root' })
export class CourseScheduleService extends CourseSchedulesService {
  protected readonly http = inject(HttpClient);

  create(courseSchedule: NewCourseSchedule): Observable<ICourseSchedule> {
    const copy = this.convertValueFromClient(courseSchedule);
    return this.http.post<RestCourseSchedule>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(courseSchedule: ICourseSchedule): Observable<ICourseSchedule> {
    const copy = this.convertValueFromClient(courseSchedule);
    return this.http
      .put<RestCourseSchedule>(`${this.resourceUrl}/${encodeURIComponent(this.getCourseScheduleIdentifier(courseSchedule))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(courseSchedule: PartialUpdateCourseSchedule): Observable<ICourseSchedule> {
    const copy = this.convertValueFromClient(courseSchedule);
    return this.http
      .patch<RestCourseSchedule>(`${this.resourceUrl}/${encodeURIComponent(this.getCourseScheduleIdentifier(courseSchedule))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<ICourseSchedule> {
    return this.http
      .get<RestCourseSchedule>(`${this.resourceUrl}/${encodeURIComponent(id)}`)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<ICourseSchedule[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCourseSchedule[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getCourseScheduleIdentifier(courseSchedule: Pick<ICourseSchedule, 'id'>): number {
    return courseSchedule.id;
  }

  compareCourseSchedule(o1: Pick<ICourseSchedule, 'id'> | null, o2: Pick<ICourseSchedule, 'id'> | null): boolean {
    return o1 && o2 ? this.getCourseScheduleIdentifier(o1) === this.getCourseScheduleIdentifier(o2) : o1 === o2;
  }

  addCourseScheduleToCollectionIfMissing<Type extends Pick<ICourseSchedule, 'id' | 'room' | 'startTime' | 'endTime'>>(
    courseScheduleCollection: Type[],
    ...courseSchedulesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const courseSchedules: Type[] = courseSchedulesToCheck.filter(isPresent);
    if (courseSchedules.length > 0) {
      const courseScheduleCollectionIdentifiers = courseScheduleCollection.map(courseScheduleItem =>
        this.getCourseScheduleIdentifier(courseScheduleItem),
      );
      const courseSchedulesToAdd = courseSchedules.filter(courseScheduleItem => {
        const courseScheduleIdentifier = this.getCourseScheduleIdentifier(courseScheduleItem);
        if (courseScheduleCollectionIdentifiers.includes(courseScheduleIdentifier)) {
          return false;
        }
        courseScheduleCollectionIdentifiers.push(courseScheduleIdentifier);
        return true;
      });
      return [...courseSchedulesToAdd, ...courseScheduleCollection];
    }
    return courseScheduleCollection;
  }

  protected convertValueFromClient<T extends ICourseSchedule | NewCourseSchedule | PartialUpdateCourseSchedule>(
    courseSchedule: T,
  ): RestOf<T> {
    return {
      ...courseSchedule,
      startTime: courseSchedule.startTime?.toJSON() ?? null,
      endTime: courseSchedule.endTime?.toJSON() ?? null,
      createdDate: courseSchedule.createdDate?.toJSON() ?? null,
      lastModifiedDate: courseSchedule.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertResponseFromServer(res: RestCourseSchedule): ICourseSchedule {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestCourseSchedule[]): ICourseSchedule[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
