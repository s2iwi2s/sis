import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
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

@Injectable({ providedIn: 'root' })
export class CurriculumMapService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/curriculum-maps');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(curriculumMap: NewCurriculumMap): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(curriculumMap);
    return this.http
      .post<RestCurriculumMap>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(curriculumMap: ICurriculumMap): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(curriculumMap);
    return this.http
      .put<RestCurriculumMap>(`${this.resourceUrl}/${this.getCurriculumMapIdentifier(curriculumMap)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(curriculumMap: PartialUpdateCurriculumMap): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(curriculumMap);
    return this.http
      .patch<RestCurriculumMap>(`${this.resourceUrl}/${this.getCurriculumMapIdentifier(curriculumMap)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestCurriculumMap>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCurriculumMap[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
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
      const curriculumMapCollectionIdentifiers = curriculumMapCollection.map(
        curriculumMapItem => this.getCurriculumMapIdentifier(curriculumMapItem)!,
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

  protected convertDateFromClient<T extends ICurriculumMap | NewCurriculumMap | PartialUpdateCurriculumMap>(curriculumMap: T): RestOf<T> {
    return {
      ...curriculumMap,
      createdDate: curriculumMap.createdDate?.toJSON() ?? null,
      lastModifiedDate: curriculumMap.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restCurriculumMap: RestCurriculumMap): ICurriculumMap {
    return {
      ...restCurriculumMap,
      createdDate: restCurriculumMap.createdDate ? dayjs(restCurriculumMap.createdDate) : undefined,
      lastModifiedDate: restCurriculumMap.lastModifiedDate ? dayjs(restCurriculumMap.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCurriculumMap>): HttpResponse<ICurriculumMap> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestCurriculumMap[]>): HttpResponse<ICurriculumMap[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
