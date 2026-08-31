import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IPayments, NewPayments } from '../payments.model';

export type PartialUpdatePayments = Partial<IPayments> & Pick<IPayments, 'id'>;

type RestOf<T extends IPayments | NewPayments> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestPayments = RestOf<IPayments>;

export type NewRestPayments = RestOf<NewPayments>;

export type PartialUpdateRestPayments = RestOf<PartialUpdatePayments>;

@Injectable()
export class PaymentsesService {
  readonly paymentsesParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly paymentsesResource = httpResource<RestPayments[]>(() => {
    const params = this.paymentsesParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of payments that have been fetched. It is updated when the paymentsesResource emits a new value.
   * In case of error while fetching the paymentses, the signal is set to an empty array.
   */
  readonly paymentses = computed(() =>
    (this.paymentsesResource.hasValue() ? this.paymentsesResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/payments');

  protected convertValueFromServer(restPayments: RestPayments): IPayments {
    return {
      ...restPayments,
      createdDate: restPayments.createdDate ? dayjs(restPayments.createdDate) : undefined,
      lastModifiedDate: restPayments.lastModifiedDate ? dayjs(restPayments.lastModifiedDate) : undefined,
    };
  }
}

@Injectable({ providedIn: 'root' })
export class PaymentsService extends PaymentsesService {
  protected readonly http = inject(HttpClient);

  create(payments: NewPayments): Observable<IPayments> {
    const copy = this.convertValueFromClient(payments);
    return this.http.post<RestPayments>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(payments: IPayments): Observable<IPayments> {
    const copy = this.convertValueFromClient(payments);
    return this.http
      .put<RestPayments>(`${this.resourceUrl}/${encodeURIComponent(this.getPaymentsIdentifier(payments))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(payments: PartialUpdatePayments): Observable<IPayments> {
    const copy = this.convertValueFromClient(payments);
    return this.http
      .patch<RestPayments>(`${this.resourceUrl}/${encodeURIComponent(this.getPaymentsIdentifier(payments))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<IPayments> {
    return this.http
      .get<RestPayments>(`${this.resourceUrl}/${encodeURIComponent(id)}`)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<IPayments[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPayments[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getPaymentsIdentifier(payments: Pick<IPayments, 'id'>): number {
    return payments.id;
  }

  comparePayments(o1: Pick<IPayments, 'id'> | null, o2: Pick<IPayments, 'id'> | null): boolean {
    return o1 && o2 ? this.getPaymentsIdentifier(o1) === this.getPaymentsIdentifier(o2) : o1 === o2;
  }

  addPaymentsToCollectionIfMissing<Type extends Pick<IPayments, 'id'>>(
    paymentsCollection: Type[],
    ...paymentsesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const paymentses: Type[] = paymentsesToCheck.filter(isPresent);
    if (paymentses.length > 0) {
      const paymentsCollectionIdentifiers = paymentsCollection.map(paymentsItem => this.getPaymentsIdentifier(paymentsItem));
      const paymentsesToAdd = paymentses.filter(paymentsItem => {
        const paymentsIdentifier = this.getPaymentsIdentifier(paymentsItem);
        if (paymentsCollectionIdentifiers.includes(paymentsIdentifier)) {
          return false;
        }
        paymentsCollectionIdentifiers.push(paymentsIdentifier);
        return true;
      });
      return [...paymentsesToAdd, ...paymentsCollection];
    }
    return paymentsCollection;
  }

  protected convertValueFromClient<T extends IPayments | NewPayments | PartialUpdatePayments>(payments: T): RestOf<T> {
    return {
      ...payments,
      createdDate: payments.createdDate?.format(DATE_FORMAT) ?? null,
      lastModifiedDate: payments.lastModifiedDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertResponseFromServer(res: RestPayments): IPayments {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestPayments[]): IPayments[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
