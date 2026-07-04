import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IAcademicYear, NewAcademicYear } from '../academic-year.model';

export type PartialUpdateAcademicYear = Partial<IAcademicYear> & Pick<IAcademicYear, 'id'>;

type RestOf<T extends IAcademicYear | NewAcademicYear> = Omit<T, 'startDate' | 'endDate' | 'createdDate' | 'lastModifiedDate'> & {
  startDate?: string | null;
  endDate?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestAcademicYear = RestOf<IAcademicYear>;

export type NewRestAcademicYear = RestOf<NewAcademicYear>;

export type PartialUpdateRestAcademicYear = RestOf<PartialUpdateAcademicYear>;

@Injectable()
export class AcademicYearsService {
  readonly academicYearsParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly academicYearsResource = httpResource<RestAcademicYear[]>(() => {
    const params = this.academicYearsParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of academicYear that have been fetched. It is updated when the academicYearsResource emits a new value.
   * In case of error while fetching the academicYears, the signal is set to an empty array.
   */
  readonly academicYears = computed(() =>
    (this.academicYearsResource.hasValue() ? this.academicYearsResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/academic-years');

  protected convertValueFromServer(restAcademicYear: RestAcademicYear): IAcademicYear {
    return {
      ...restAcademicYear,
      startDate: restAcademicYear.startDate ? dayjs(restAcademicYear.startDate) : undefined,
      endDate: restAcademicYear.endDate ? dayjs(restAcademicYear.endDate) : undefined,
      createdDate: restAcademicYear.createdDate ? dayjs(restAcademicYear.createdDate) : undefined,
      lastModifiedDate: restAcademicYear.lastModifiedDate ? dayjs(restAcademicYear.lastModifiedDate) : undefined,
    };
  }
}

@Injectable({ providedIn: 'root' })
export class AcademicYearService extends AcademicYearsService {
  protected readonly http = inject(HttpClient);

  create(academicYear: NewAcademicYear): Observable<IAcademicYear> {
    const copy = this.convertValueFromClient(academicYear);
    return this.http.post<RestAcademicYear>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(academicYear: IAcademicYear): Observable<IAcademicYear> {
    const copy = this.convertValueFromClient(academicYear);
    return this.http
      .put<RestAcademicYear>(`${this.resourceUrl}/${encodeURIComponent(this.getAcademicYearIdentifier(academicYear))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(academicYear: PartialUpdateAcademicYear): Observable<IAcademicYear> {
    const copy = this.convertValueFromClient(academicYear);
    return this.http
      .patch<RestAcademicYear>(`${this.resourceUrl}/${encodeURIComponent(this.getAcademicYearIdentifier(academicYear))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<IAcademicYear> {
    return this.http
      .get<RestAcademicYear>(`${this.resourceUrl}/${encodeURIComponent(id)}`)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<IAcademicYear[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAcademicYear[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getAcademicYearIdentifier(academicYear: Pick<IAcademicYear, 'id'>): number {
    return academicYear.id;
  }

  compareAcademicYear(o1: Pick<IAcademicYear, 'id'> | null, o2: Pick<IAcademicYear, 'id'> | null): boolean {
    return o1 && o2 ? this.getAcademicYearIdentifier(o1) === this.getAcademicYearIdentifier(o2) : o1 === o2;
  }

  addAcademicYearToCollectionIfMissing<Type extends Pick<IAcademicYear, 'id'>>(
    academicYearCollection: Type[],
    ...academicYearsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const academicYears: Type[] = academicYearsToCheck.filter(isPresent);
    if (academicYears.length > 0) {
      const academicYearCollectionIdentifiers = academicYearCollection.map(academicYearItem =>
        this.getAcademicYearIdentifier(academicYearItem),
      );
      const academicYearsToAdd = academicYears.filter(academicYearItem => {
        const academicYearIdentifier = this.getAcademicYearIdentifier(academicYearItem);
        if (academicYearCollectionIdentifiers.includes(academicYearIdentifier)) {
          return false;
        }
        academicYearCollectionIdentifiers.push(academicYearIdentifier);
        return true;
      });
      return [...academicYearsToAdd, ...academicYearCollection];
    }
    return academicYearCollection;
  }

  protected convertValueFromClient<T extends IAcademicYear | NewAcademicYear | PartialUpdateAcademicYear>(academicYear: T): RestOf<T> {
    return {
      ...academicYear,
      startDate: academicYear.startDate?.format(DATE_FORMAT) ?? null,
      endDate: academicYear.endDate?.format(DATE_FORMAT) ?? null,
      createdDate: academicYear.createdDate?.toJSON() ?? null,
      lastModifiedDate: academicYear.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertResponseFromServer(res: RestAcademicYear): IAcademicYear {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestAcademicYear[]): IAcademicYear[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
