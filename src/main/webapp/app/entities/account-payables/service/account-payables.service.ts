import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IAccountPayables, NewAccountPayables } from '../account-payables.model';

export type PartialUpdateAccountPayables = Partial<IAccountPayables> & Pick<IAccountPayables, 'id'>;

type RestOf<T extends IAccountPayables | NewAccountPayables> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestAccountPayables = RestOf<IAccountPayables>;

export type NewRestAccountPayables = RestOf<NewAccountPayables>;

export type PartialUpdateRestAccountPayables = RestOf<PartialUpdateAccountPayables>;

@Injectable()
export class AccountPayablesesService {
  readonly accountPayablesesParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly accountPayablesesResource = httpResource<RestAccountPayables[]>(() => {
    const params = this.accountPayablesesParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of accountPayables that have been fetched. It is updated when the accountPayablesesResource emits a new value.
   * In case of error while fetching the accountPayableses, the signal is set to an empty array.
   */
  readonly accountPayableses = computed(() =>
    (this.accountPayablesesResource.hasValue() ? this.accountPayablesesResource.value() : []).map(item =>
      this.convertValueFromServer(item),
    ),
  );
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/account-payables');

  protected convertValueFromServer(restAccountPayables: RestAccountPayables): IAccountPayables {
    return {
      ...restAccountPayables,
      createdDate: restAccountPayables.createdDate ? dayjs(restAccountPayables.createdDate) : undefined,
      lastModifiedDate: restAccountPayables.lastModifiedDate ? dayjs(restAccountPayables.lastModifiedDate) : undefined,
    };
  }
}

@Injectable({ providedIn: 'root' })
export class AccountPayablesService extends AccountPayablesesService {
  protected readonly http = inject(HttpClient);

  create(accountPayables: NewAccountPayables): Observable<IAccountPayables> {
    const copy = this.convertValueFromClient(accountPayables);
    return this.http.post<RestAccountPayables>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(accountPayables: IAccountPayables): Observable<IAccountPayables> {
    const copy = this.convertValueFromClient(accountPayables);
    return this.http
      .put<RestAccountPayables>(`${this.resourceUrl}/${encodeURIComponent(this.getAccountPayablesIdentifier(accountPayables))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(accountPayables: PartialUpdateAccountPayables): Observable<IAccountPayables> {
    const copy = this.convertValueFromClient(accountPayables);
    return this.http
      .patch<RestAccountPayables>(`${this.resourceUrl}/${encodeURIComponent(this.getAccountPayablesIdentifier(accountPayables))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<IAccountPayables> {
    return this.http
      .get<RestAccountPayables>(`${this.resourceUrl}/${encodeURIComponent(id)}`)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<IAccountPayables[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAccountPayables[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getAccountPayablesIdentifier(accountPayables: Pick<IAccountPayables, 'id'>): number {
    return accountPayables.id;
  }

  compareAccountPayables(o1: Pick<IAccountPayables, 'id'> | null, o2: Pick<IAccountPayables, 'id'> | null): boolean {
    return o1 && o2 ? this.getAccountPayablesIdentifier(o1) === this.getAccountPayablesIdentifier(o2) : o1 === o2;
  }

  addAccountPayablesToCollectionIfMissing<Type extends Pick<IAccountPayables, 'id'>>(
    accountPayablesCollection: Type[],
    ...accountPayablesesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const accountPayableses: Type[] = accountPayablesesToCheck.filter(isPresent);
    if (accountPayableses.length > 0) {
      const accountPayablesCollectionIdentifiers = accountPayablesCollection.map(accountPayablesItem =>
        this.getAccountPayablesIdentifier(accountPayablesItem),
      );
      const accountPayablesesToAdd = accountPayableses.filter(accountPayablesItem => {
        const accountPayablesIdentifier = this.getAccountPayablesIdentifier(accountPayablesItem);
        if (accountPayablesCollectionIdentifiers.includes(accountPayablesIdentifier)) {
          return false;
        }
        accountPayablesCollectionIdentifiers.push(accountPayablesIdentifier);
        return true;
      });
      return [...accountPayablesesToAdd, ...accountPayablesCollection];
    }
    return accountPayablesCollection;
  }

  protected convertValueFromClient<T extends IAccountPayables | NewAccountPayables | PartialUpdateAccountPayables>(
    accountPayables: T,
  ): RestOf<T> {
    return {
      ...accountPayables,
      createdDate: accountPayables.createdDate?.format(DATE_FORMAT) ?? null,
      lastModifiedDate: accountPayables.lastModifiedDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertResponseFromServer(res: RestAccountPayables): IAccountPayables {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestAccountPayables[]): IAccountPayables[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
