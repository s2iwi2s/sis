import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICurriculumMap, NewCurriculumMap } from '../curriculum-map.model';

export type PartialUpdateCurriculumMap = Partial<ICurriculumMap> & Pick<ICurriculumMap, 'id'>;

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
    return this.http.post<ICurriculumMap>(this.resourceUrl, curriculumMap, { observe: 'response' });
  }

  update(curriculumMap: ICurriculumMap): Observable<EntityResponseType> {
    return this.http.put<ICurriculumMap>(`${this.resourceUrl}/${this.getCurriculumMapIdentifier(curriculumMap)}`, curriculumMap, {
      observe: 'response',
    });
  }

  partialUpdate(curriculumMap: PartialUpdateCurriculumMap): Observable<EntityResponseType> {
    return this.http.patch<ICurriculumMap>(`${this.resourceUrl}/${this.getCurriculumMapIdentifier(curriculumMap)}`, curriculumMap, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICurriculumMap>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICurriculumMap[]>(this.resourceUrl, { params: options, observe: 'response' });
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
}
