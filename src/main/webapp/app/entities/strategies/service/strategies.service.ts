import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IStrategies, NewStrategies } from '../strategies.model';

export type PartialUpdateStrategies = Partial<IStrategies> & Pick<IStrategies, 'id'>;

type RestOf<T extends IStrategies | NewStrategies> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestStrategies = RestOf<IStrategies>;

export type NewRestStrategies = RestOf<NewStrategies>;

export type PartialUpdateRestStrategies = RestOf<PartialUpdateStrategies>;

export type EntityResponseType = HttpResponse<IStrategies>;
export type EntityArrayResponseType = HttpResponse<IStrategies[]>;

@Injectable({ providedIn: 'root' })
export class StrategiesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/strategies');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(strategies: NewStrategies): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(strategies);
    return this.http
      .post<RestStrategies>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(strategies: IStrategies): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(strategies);
    return this.http
      .put<RestStrategies>(`${this.resourceUrl}/${this.getStrategiesIdentifier(strategies)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(strategies: PartialUpdateStrategies): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(strategies);
    return this.http
      .patch<RestStrategies>(`${this.resourceUrl}/${this.getStrategiesIdentifier(strategies)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestStrategies>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestStrategies[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getStrategiesIdentifier(strategies: Pick<IStrategies, 'id'>): number {
    return strategies.id;
  }

  compareStrategies(o1: Pick<IStrategies, 'id'> | null, o2: Pick<IStrategies, 'id'> | null): boolean {
    return o1 && o2 ? this.getStrategiesIdentifier(o1) === this.getStrategiesIdentifier(o2) : o1 === o2;
  }

  addStrategiesToCollectionIfMissing<Type extends Pick<IStrategies, 'id'>>(
    strategiesCollection: Type[],
    ...strategiesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const strategies: Type[] = strategiesToCheck.filter(isPresent);
    if (strategies.length > 0) {
      const strategiesCollectionIdentifiers = strategiesCollection.map(strategiesItem => this.getStrategiesIdentifier(strategiesItem)!);
      const strategiesToAdd = strategies.filter(strategiesItem => {
        const strategiesIdentifier = this.getStrategiesIdentifier(strategiesItem);
        if (strategiesCollectionIdentifiers.includes(strategiesIdentifier)) {
          return false;
        }
        strategiesCollectionIdentifiers.push(strategiesIdentifier);
        return true;
      });
      return [...strategiesToAdd, ...strategiesCollection];
    }
    return strategiesCollection;
  }

  protected convertDateFromClient<T extends IStrategies | NewStrategies | PartialUpdateStrategies>(strategies: T): RestOf<T> {
    return {
      ...strategies,
      createdDate: strategies.createdDate?.toJSON() ?? null,
      lastModifiedDate: strategies.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restStrategies: RestStrategies): IStrategies {
    return {
      ...restStrategies,
      createdDate: restStrategies.createdDate ? dayjs(restStrategies.createdDate) : undefined,
      lastModifiedDate: restStrategies.lastModifiedDate ? dayjs(restStrategies.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestStrategies>): HttpResponse<IStrategies> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestStrategies[]>): HttpResponse<IStrategies[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
