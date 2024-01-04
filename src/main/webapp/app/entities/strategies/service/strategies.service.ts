import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IStrategies, NewStrategies } from '../strategies.model';

export type PartialUpdateStrategies = Partial<IStrategies> & Pick<IStrategies, 'id'>;

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
    return this.http.post<IStrategies>(this.resourceUrl, strategies, { observe: 'response' });
  }

  update(strategies: IStrategies): Observable<EntityResponseType> {
    return this.http.put<IStrategies>(`${this.resourceUrl}/${this.getStrategiesIdentifier(strategies)}`, strategies, {
      observe: 'response',
    });
  }

  partialUpdate(strategies: PartialUpdateStrategies): Observable<EntityResponseType> {
    return this.http.patch<IStrategies>(`${this.resourceUrl}/${this.getStrategiesIdentifier(strategies)}`, strategies, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IStrategies>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IStrategies[]>(this.resourceUrl, { params: options, observe: 'response' });
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
}
