import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IInvoices, NewInvoices } from '../invoices.model';

export type PartialUpdateInvoices = Partial<IInvoices> & Pick<IInvoices, 'id'>;

type RestOf<T extends IInvoices | NewInvoices> = Omit<T, 'dueDate' | 'createdDate' | 'lastModifiedDate'> & {
  dueDate?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestInvoices = RestOf<IInvoices>;

export type NewRestInvoices = RestOf<NewInvoices>;

export type PartialUpdateRestInvoices = RestOf<PartialUpdateInvoices>;

@Injectable()
export class InvoicesesService {
  readonly invoicesesParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly invoicesesResource = httpResource<RestInvoices[]>(() => {
    const params = this.invoicesesParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of invoices that have been fetched. It is updated when the invoicesesResource emits a new value.
   * In case of error while fetching the invoiceses, the signal is set to an empty array.
   */
  readonly invoiceses = computed(() =>
    (this.invoicesesResource.hasValue() ? this.invoicesesResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/invoices');

  protected convertValueFromServer(restInvoices: RestInvoices): IInvoices {
    return {
      ...restInvoices,
      dueDate: restInvoices.dueDate ? dayjs(restInvoices.dueDate) : undefined,
      createdDate: restInvoices.createdDate ? dayjs(restInvoices.createdDate) : undefined,
      lastModifiedDate: restInvoices.lastModifiedDate ? dayjs(restInvoices.lastModifiedDate) : undefined,
    };
  }
}

@Injectable({ providedIn: 'root' })
export class InvoicesService extends InvoicesesService {
  protected readonly http = inject(HttpClient);

  create(invoices: NewInvoices): Observable<IInvoices> {
    const copy = this.convertValueFromClient(invoices);
    return this.http.post<RestInvoices>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(invoices: IInvoices): Observable<IInvoices> {
    const copy = this.convertValueFromClient(invoices);
    return this.http
      .put<RestInvoices>(`${this.resourceUrl}/${encodeURIComponent(this.getInvoicesIdentifier(invoices))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(invoices: PartialUpdateInvoices): Observable<IInvoices> {
    const copy = this.convertValueFromClient(invoices);
    return this.http
      .patch<RestInvoices>(`${this.resourceUrl}/${encodeURIComponent(this.getInvoicesIdentifier(invoices))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<IInvoices> {
    return this.http
      .get<RestInvoices>(`${this.resourceUrl}/${encodeURIComponent(id)}`)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<IInvoices[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestInvoices[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getInvoicesIdentifier(invoices: Pick<IInvoices, 'id'>): number {
    return invoices.id;
  }

  compareInvoices(o1: Pick<IInvoices, 'id'> | null, o2: Pick<IInvoices, 'id'> | null): boolean {
    return o1 && o2 ? this.getInvoicesIdentifier(o1) === this.getInvoicesIdentifier(o2) : o1 === o2;
  }

  addInvoicesToCollectionIfMissing<Type extends Pick<IInvoices, 'id'>>(
    invoicesCollection: Type[],
    ...invoicesesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const invoiceses: Type[] = invoicesesToCheck.filter(isPresent);
    if (invoiceses.length > 0) {
      const invoicesCollectionIdentifiers = invoicesCollection.map(invoicesItem => this.getInvoicesIdentifier(invoicesItem));
      const invoicesesToAdd = invoiceses.filter(invoicesItem => {
        const invoicesIdentifier = this.getInvoicesIdentifier(invoicesItem);
        if (invoicesCollectionIdentifiers.includes(invoicesIdentifier)) {
          return false;
        }
        invoicesCollectionIdentifiers.push(invoicesIdentifier);
        return true;
      });
      return [...invoicesesToAdd, ...invoicesCollection];
    }
    return invoicesCollection;
  }

  protected convertValueFromClient<T extends IInvoices | NewInvoices | PartialUpdateInvoices>(invoices: T): RestOf<T> {
    return {
      ...invoices,
      dueDate: invoices.dueDate?.format(DATE_FORMAT) ?? null,
      createdDate: invoices.createdDate?.format(DATE_FORMAT) ?? null,
      lastModifiedDate: invoices.lastModifiedDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertResponseFromServer(res: RestInvoices): IInvoices {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestInvoices[]): IInvoices[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
