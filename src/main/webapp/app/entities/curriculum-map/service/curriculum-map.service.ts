import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { ICurriculumMap, NewCurriculumMap } from '../curriculum-map.model';

export type PartialUpdateCurriculumMap = Partial<ICurriculumMap> & Pick<ICurriculumMap, 'id'>;

type RestOf<T extends ICurriculumMap | NewCurriculumMap> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestCurriculumMap = RestOf<ICurriculumMap>;

export type NewRestCurriculumMap = RestOf<NewCurriculumMap>;

export type PartialUpdateRestCurriculumMap = RestOf<PartialUpdateCurriculumMap>;

export type EntityResponseType = HttpResponse<ICurriculumMap>;
export type EntityArrayResponseType = HttpResponse<ICurriculumMap[]>;

@Injectable()
export class CurriculumMapsService {
  readonly curriculumMapsParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly curriculumMapsResource = httpResource<RestCurriculumMap[]>(() => {
    const params = this.curriculumMapsParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of curriculumMap that have been fetched. It is updated when the curriculumMapsResource emits a new value.
   * In case of error while fetching the curriculumMaps, the signal is set to an empty array.
   */
  readonly curriculumMaps = computed(() =>
    (this.curriculumMapsResource.hasValue() ? this.curriculumMapsResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/curriculum-maps');

  protected convertValueFromServer(restCurriculumMap: RestCurriculumMap): ICurriculumMap {
    return {
      ...restCurriculumMap,
      createdDate: restCurriculumMap.createdDate ? dayjs(restCurriculumMap.createdDate) : undefined,
      lastModifiedDate: restCurriculumMap.lastModifiedDate ? dayjs(restCurriculumMap.lastModifiedDate) : undefined,
    };
  }
}

@Injectable({ providedIn: 'root' })
export class CurriculumMapService extends CurriculumMapsService {
  protected readonly http = inject(HttpClient);

  create(curriculumMap: NewCurriculumMap): Observable<ICurriculumMap> {
    const copy = this.convertValueFromClient(curriculumMap);
    return this.http.post<RestCurriculumMap>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(curriculumMap: ICurriculumMap): Observable<ICurriculumMap> {
    const copy = this.convertValueFromClient(curriculumMap);
    return this.http
      .put<RestCurriculumMap>(`${this.resourceUrl}/${encodeURIComponent(this.getCurriculumMapIdentifier(curriculumMap))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(curriculumMap: PartialUpdateCurriculumMap): Observable<ICurriculumMap> {
    const copy = this.convertValueFromClient(curriculumMap);
    return this.http
      .patch<RestCurriculumMap>(`${this.resourceUrl}/${encodeURIComponent(this.getCurriculumMapIdentifier(curriculumMap))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<ICurriculumMap> {
    return this.http
      .get<RestCurriculumMap>(`${this.resourceUrl}/${encodeURIComponent(id)}`)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<ICurriculumMap[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCurriculumMap[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  queryByCourse(courseId: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<RestCurriculumMap[]>(`${this.resourceUrl}/${courseId}/course`, { observe: 'response' })
      .pipe(map(res => this.convertHttpResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getCurriculumMapIdentifier(curriculumMap: Pick<ICurriculumMap, 'id'>): number {
    return curriculumMap.id;
  }

  compareCurriculumMap(o1: Pick<ICurriculumMap, 'id'> | null, o2: Pick<ICurriculumMap, 'id'> | null): boolean {
    return o1 && o2 ? this.getCurriculumMapIdentifier(o1) === this.getCurriculumMapIdentifier(o2) : o1 === o2;
  }

  addCurriculumMapToCollectionIfMissing<Type extends Pick<ICurriculumMap, 'id'>>(
    curriculumMapCollection: Type[],
    ...curriculumMapsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const curriculumMaps: Type[] = curriculumMapsToCheck.filter(isPresent);
    if (curriculumMaps.length > 0) {
      const curriculumMapCollectionIdentifiers = curriculumMapCollection.map(curriculumMapItem =>
        this.getCurriculumMapIdentifier(curriculumMapItem),
      );
      const curriculumMapsToAdd = curriculumMaps.filter(curriculumMapItem => {
        const curriculumMapIdentifier = this.getCurriculumMapIdentifier(curriculumMapItem);
        if (curriculumMapCollectionIdentifiers.includes(curriculumMapIdentifier)) {
          return false;
        }
        curriculumMapCollectionIdentifiers.push(curriculumMapIdentifier);
        return true;
      });
      return [...curriculumMapsToAdd, ...curriculumMapCollection];
    }
    return curriculumMapCollection;
  }

  protected convertValueFromClient<T extends ICurriculumMap | NewCurriculumMap | PartialUpdateCurriculumMap>(curriculumMap: T): RestOf<T> {
    return {
      ...curriculumMap,
      createdDate: curriculumMap.createdDate?.toJSON() ?? null,
      lastModifiedDate: curriculumMap.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertResponseFromServer(res: RestCurriculumMap): ICurriculumMap {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestCurriculumMap[]): ICurriculumMap[] {
    return res.map(item => this.convertValueFromServer(item));
  }

  protected convertHttpResponseArrayFromServer(res: HttpResponse<RestCurriculumMap[]>): HttpResponse<ICurriculumMap[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertValueFromServer(item)) : null,
    });
  }
}
