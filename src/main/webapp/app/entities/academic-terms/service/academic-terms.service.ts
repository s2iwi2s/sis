import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IAcademicTerms, NewAcademicTerms } from '../academic-terms.model';

export type PartialUpdateAcademicTerms = Partial<IAcademicTerms> & Pick<IAcademicTerms, 'id'>;

type RestOf<T extends IAcademicTerms | NewAcademicTerms> = Omit<T, 'startDate' | 'endDate' | 'createdDate' | 'lastModifiedDate'> & {
  startDate?: string | null;
  endDate?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestAcademicTerms = RestOf<IAcademicTerms>;

export type NewRestAcademicTerms = RestOf<NewAcademicTerms>;

export type PartialUpdateRestAcademicTerms = RestOf<PartialUpdateAcademicTerms>;

@Injectable()
export class AcademicTermsesService {
  readonly academicTermsesParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly academicTermsesResource = httpResource<RestAcademicTerms[]>(() => {
    const params = this.academicTermsesParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of academicTerms that have been fetched. It is updated when the academicTermsesResource emits a new value.
   * In case of error while fetching the academicTermses, the signal is set to an empty array.
   */
  readonly academicTermses = computed(() =>
    (this.academicTermsesResource.hasValue() ? this.academicTermsesResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/academic-terms');

  protected convertValueFromServer(restAcademicTerms: RestAcademicTerms): IAcademicTerms {
    return {
      ...restAcademicTerms,
      startDate: restAcademicTerms.startDate ? dayjs(restAcademicTerms.startDate) : undefined,
      endDate: restAcademicTerms.endDate ? dayjs(restAcademicTerms.endDate) : undefined,
      createdDate: restAcademicTerms.createdDate ? dayjs(restAcademicTerms.createdDate) : undefined,
      lastModifiedDate: restAcademicTerms.lastModifiedDate ? dayjs(restAcademicTerms.lastModifiedDate) : undefined,
    };
  }
}

@Injectable({ providedIn: 'root' })
export class AcademicTermsService extends AcademicTermsesService {
  protected readonly http = inject(HttpClient);

  create(academicTerms: NewAcademicTerms): Observable<IAcademicTerms> {
    const copy = this.convertValueFromClient(academicTerms);
    return this.http.post<RestAcademicTerms>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(academicTerms: IAcademicTerms): Observable<IAcademicTerms> {
    const copy = this.convertValueFromClient(academicTerms);
    return this.http
      .put<RestAcademicTerms>(`${this.resourceUrl}/${encodeURIComponent(this.getAcademicTermsIdentifier(academicTerms))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(academicTerms: PartialUpdateAcademicTerms): Observable<IAcademicTerms> {
    const copy = this.convertValueFromClient(academicTerms);
    return this.http
      .patch<RestAcademicTerms>(`${this.resourceUrl}/${encodeURIComponent(this.getAcademicTermsIdentifier(academicTerms))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<IAcademicTerms> {
    return this.http
      .get<RestAcademicTerms>(`${this.resourceUrl}/${encodeURIComponent(id)}`)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<IAcademicTerms[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAcademicTerms[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getAcademicTermsIdentifier(academicTerms: Pick<IAcademicTerms, 'id'>): number {
    return academicTerms.id;
  }

  compareAcademicTerms(o1: Pick<IAcademicTerms, 'id'> | null, o2: Pick<IAcademicTerms, 'id'> | null): boolean {
    return o1 && o2 ? this.getAcademicTermsIdentifier(o1) === this.getAcademicTermsIdentifier(o2) : o1 === o2;
  }

  addAcademicTermsToCollectionIfMissing<Type extends Pick<IAcademicTerms, 'id'>>(
    academicTermsCollection: Type[],
    ...academicTermsesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const academicTermses: Type[] = academicTermsesToCheck.filter(isPresent);
    if (academicTermses.length > 0) {
      const academicTermsCollectionIdentifiers = academicTermsCollection.map(academicTermsItem =>
        this.getAcademicTermsIdentifier(academicTermsItem),
      );
      const academicTermsesToAdd = academicTermses.filter(academicTermsItem => {
        const academicTermsIdentifier = this.getAcademicTermsIdentifier(academicTermsItem);
        if (academicTermsCollectionIdentifiers.includes(academicTermsIdentifier)) {
          return false;
        }
        academicTermsCollectionIdentifiers.push(academicTermsIdentifier);
        return true;
      });
      return [...academicTermsesToAdd, ...academicTermsCollection];
    }
    return academicTermsCollection;
  }

  protected convertValueFromClient<T extends IAcademicTerms | NewAcademicTerms | PartialUpdateAcademicTerms>(academicTerms: T): RestOf<T> {
    return {
      ...academicTerms,
      startDate: academicTerms.startDate?.format(DATE_FORMAT) ?? null,
      endDate: academicTerms.endDate?.format(DATE_FORMAT) ?? null,
      createdDate: academicTerms.createdDate?.toJSON() ?? null,
      lastModifiedDate: academicTerms.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertResponseFromServer(res: RestAcademicTerms): IAcademicTerms {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestAcademicTerms[]): IAcademicTerms[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
