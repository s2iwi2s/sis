import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IStrategies, NewStrategies } from '../strategies.model';

export type PartialUpdateStrategies = Partial<IStrategies> & Pick<IStrategies, 'id'>;

type RestOf<T extends IStrategies | NewStrategies> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestStrategies = RestOf<IStrategies>;

export type NewRestStrategies = RestOf<NewStrategies>;

export type PartialUpdateRestStrategies = RestOf<PartialUpdateStrategies>;

@Injectable()
export class StrategiesesService {
  readonly strategiesesParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly strategiesesResource = httpResource<RestStrategies[]>(() => {
    const params = this.strategiesesParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of strategies that have been fetched. It is updated when the strategiesesResource emits a new value.
   * In case of error while fetching the strategieses, the signal is set to an empty array.
   */
  readonly strategieses = computed(() =>
    (this.strategiesesResource.hasValue() ? this.strategiesesResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/strategies');

  protected convertValueFromServer(restStrategies: RestStrategies): IStrategies {
    return {
      ...restStrategies,
      createdDate: restStrategies.createdDate ? dayjs(restStrategies.createdDate) : undefined,
      lastModifiedDate: restStrategies.lastModifiedDate ? dayjs(restStrategies.lastModifiedDate) : undefined,
    };
  }
}

@Injectable({ providedIn: 'root' })
export class StrategiesService extends StrategiesesService {
  protected readonly http = inject(HttpClient);

  create(strategies: NewStrategies): Observable<IStrategies> {
    const copy = this.convertValueFromClient(strategies);
    return this.http.post<RestStrategies>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(strategies: IStrategies): Observable<IStrategies> {
    const copy = this.convertValueFromClient(strategies);
    return this.http
      .put<RestStrategies>(`${this.resourceUrl}/${encodeURIComponent(this.getStrategiesIdentifier(strategies))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(strategies: PartialUpdateStrategies): Observable<IStrategies> {
    const copy = this.convertValueFromClient(strategies);
    return this.http
      .patch<RestStrategies>(`${this.resourceUrl}/${encodeURIComponent(this.getStrategiesIdentifier(strategies))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<IStrategies> {
    return this.http
      .get<RestStrategies>(`${this.resourceUrl}/${encodeURIComponent(id)}`)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<IStrategies[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestStrategies[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getStrategiesIdentifier(strategies: Pick<IStrategies, 'id'>): number {
    return strategies.id;
  }

  compareStrategies(o1: Pick<IStrategies, 'id'> | null, o2: Pick<IStrategies, 'id'> | null): boolean {
    return o1 && o2 ? this.getStrategiesIdentifier(o1) === this.getStrategiesIdentifier(o2) : o1 === o2;
  }

  addStrategiesToCollectionIfMissing<Type extends Pick<IStrategies, 'id'>>(
    strategiesCollection: Type[],
    ...strategiesesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const strategieses: Type[] = strategiesesToCheck.filter(isPresent);
    if (strategieses.length > 0) {
      const strategiesCollectionIdentifiers = strategiesCollection.map(strategiesItem => this.getStrategiesIdentifier(strategiesItem));
      const strategiesesToAdd = strategieses.filter(strategiesItem => {
        const strategiesIdentifier = this.getStrategiesIdentifier(strategiesItem);
        if (strategiesCollectionIdentifiers.includes(strategiesIdentifier)) {
          return false;
        }
        strategiesCollectionIdentifiers.push(strategiesIdentifier);
        return true;
      });
      return [...strategiesesToAdd, ...strategiesCollection];
    }
    return strategiesCollection;
  }

  protected convertValueFromClient<T extends IStrategies | NewStrategies | PartialUpdateStrategies>(strategies: T): RestOf<T> {
    return {
      ...strategies,
      createdDate: strategies.createdDate?.toJSON() ?? null,
      lastModifiedDate: strategies.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertResponseFromServer(res: RestStrategies): IStrategies {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestStrategies[]): IStrategies[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
