import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IEnrollment, NewEnrollment } from '../enrollment.model';

export type PartialUpdateEnrollment = Partial<IEnrollment> & Pick<IEnrollment, 'id'>;

type RestOf<T extends IEnrollment | NewEnrollment> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestEnrollment = RestOf<IEnrollment>;

export type NewRestEnrollment = RestOf<NewEnrollment>;

export type PartialUpdateRestEnrollment = RestOf<PartialUpdateEnrollment>;

@Injectable()
export class EnrollmentsService {
  readonly enrollmentsParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly enrollmentsResource = httpResource<RestEnrollment[]>(() => {
    const params = this.enrollmentsParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of enrollment that have been fetched. It is updated when the enrollmentsResource emits a new value.
   * In case of error while fetching the enrollments, the signal is set to an empty array.
   */
  readonly enrollments = computed(() =>
    (this.enrollmentsResource.hasValue() ? this.enrollmentsResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/enrollments');

  protected convertValueFromServer(restEnrollment: RestEnrollment): IEnrollment {
    return {
      ...restEnrollment,
      createdDate: restEnrollment.createdDate ? dayjs(restEnrollment.createdDate) : undefined,
      lastModifiedDate: restEnrollment.lastModifiedDate ? dayjs(restEnrollment.lastModifiedDate) : undefined,
    };
  }
}

@Injectable({ providedIn: 'root' })
export class EnrollmentService extends EnrollmentsService {
  protected readonly http = inject(HttpClient);

  create(enrollment: NewEnrollment): Observable<IEnrollment> {
    const copy = this.convertValueFromClient(enrollment);
    return this.http.post<RestEnrollment>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(enrollment: IEnrollment): Observable<IEnrollment> {
    const copy = this.convertValueFromClient(enrollment);
    return this.http
      .put<RestEnrollment>(`${this.resourceUrl}/${encodeURIComponent(this.getEnrollmentIdentifier(enrollment))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(enrollment: PartialUpdateEnrollment): Observable<IEnrollment> {
    const copy = this.convertValueFromClient(enrollment);
    return this.http
      .patch<RestEnrollment>(`${this.resourceUrl}/${encodeURIComponent(this.getEnrollmentIdentifier(enrollment))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<IEnrollment> {
    return this.http
      .get<RestEnrollment>(`${this.resourceUrl}/${encodeURIComponent(id)}`)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<IEnrollment[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestEnrollment[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getEnrollmentIdentifier(enrollment: Pick<IEnrollment, 'id'>): number {
    return enrollment.id;
  }

  compareEnrollment(o1: Pick<IEnrollment, 'id'> | null, o2: Pick<IEnrollment, 'id'> | null): boolean {
    return o1 && o2 ? this.getEnrollmentIdentifier(o1) === this.getEnrollmentIdentifier(o2) : o1 === o2;
  }

  addEnrollmentToCollectionIfMissing<Type extends Pick<IEnrollment, 'id'>>(
    enrollmentCollection: Type[],
    ...enrollmentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const enrollments: Type[] = enrollmentsToCheck.filter(isPresent);
    if (enrollments.length > 0) {
      const enrollmentCollectionIdentifiers = enrollmentCollection.map(enrollmentItem => this.getEnrollmentIdentifier(enrollmentItem));
      const enrollmentsToAdd = enrollments.filter(enrollmentItem => {
        const enrollmentIdentifier = this.getEnrollmentIdentifier(enrollmentItem);
        if (enrollmentCollectionIdentifiers.includes(enrollmentIdentifier)) {
          return false;
        }
        enrollmentCollectionIdentifiers.push(enrollmentIdentifier);
        return true;
      });
      return [...enrollmentsToAdd, ...enrollmentCollection];
    }
    return enrollmentCollection;
  }

  protected convertValueFromClient<T extends IEnrollment | NewEnrollment | PartialUpdateEnrollment>(enrollment: T): RestOf<T> {
    return {
      ...enrollment,
      createdDate: enrollment.createdDate?.toJSON() ?? null,
      lastModifiedDate: enrollment.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertResponseFromServer(res: RestEnrollment): IEnrollment {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestEnrollment[]): IEnrollment[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
