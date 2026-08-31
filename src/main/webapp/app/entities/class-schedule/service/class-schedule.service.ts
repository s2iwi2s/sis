import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IClassSchedule, NewClassSchedule } from '../class-schedule.model';

export type PartialUpdateClassSchedule = Partial<IClassSchedule> & Pick<IClassSchedule, 'id'>;

@Injectable()
export class ClassSchedulesService {
  readonly classSchedulesParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly classSchedulesResource = httpResource<IClassSchedule[]>(() => {
    const params = this.classSchedulesParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of classSchedule that have been fetched. It is updated when the classSchedulesResource emits a new value.
   * In case of error while fetching the classSchedules, the signal is set to an empty array.
   */
  readonly classSchedules = computed(() => (this.classSchedulesResource.hasValue() ? this.classSchedulesResource.value() : []));
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/class-schedules');
}

@Injectable({ providedIn: 'root' })
export class ClassScheduleService extends ClassSchedulesService {
  protected readonly http = inject(HttpClient);

  create(classSchedule: NewClassSchedule): Observable<IClassSchedule> {
    return this.http.post<IClassSchedule>(this.resourceUrl, classSchedule);
  }

  update(classSchedule: IClassSchedule): Observable<IClassSchedule> {
    return this.http.put<IClassSchedule>(
      `${this.resourceUrl}/${encodeURIComponent(this.getClassScheduleIdentifier(classSchedule))}`,
      classSchedule,
    );
  }

  partialUpdate(classSchedule: PartialUpdateClassSchedule): Observable<IClassSchedule> {
    return this.http.patch<IClassSchedule>(
      `${this.resourceUrl}/${encodeURIComponent(this.getClassScheduleIdentifier(classSchedule))}`,
      classSchedule,
    );
  }

  find(id: number): Observable<IClassSchedule> {
    return this.http.get<IClassSchedule>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  query(req?: any): Observable<HttpResponse<IClassSchedule[]>> {
    const options = createRequestOption(req);
    return this.http.get<IClassSchedule[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getClassScheduleIdentifier(classSchedule: Pick<IClassSchedule, 'id'>): number {
    return classSchedule.id;
  }

  compareClassSchedule(o1: Pick<IClassSchedule, 'id'> | null, o2: Pick<IClassSchedule, 'id'> | null): boolean {
    return o1 && o2 ? this.getClassScheduleIdentifier(o1) === this.getClassScheduleIdentifier(o2) : o1 === o2;
  }

  addClassScheduleToCollectionIfMissing<Type extends Pick<IClassSchedule, 'id'>>(
    classScheduleCollection: Type[],
    ...classSchedulesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const classSchedules: Type[] = classSchedulesToCheck.filter(isPresent);
    if (classSchedules.length > 0) {
      const classScheduleCollectionIdentifiers = classScheduleCollection.map(classScheduleItem =>
        this.getClassScheduleIdentifier(classScheduleItem),
      );
      const classSchedulesToAdd = classSchedules.filter(classScheduleItem => {
        const classScheduleIdentifier = this.getClassScheduleIdentifier(classScheduleItem);
        if (classScheduleCollectionIdentifiers.includes(classScheduleIdentifier)) {
          return false;
        }
        classScheduleCollectionIdentifiers.push(classScheduleIdentifier);
        return true;
      });
      return [...classSchedulesToAdd, ...classScheduleCollection];
    }
    return classScheduleCollection;
  }
}
