import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOrg, NewOrg } from '../org.model';

export type PartialUpdateOrg = Partial<IOrg> & Pick<IOrg, 'id'>;

type RestOf<T extends IOrg | NewOrg> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestOrg = RestOf<IOrg>;

export type NewRestOrg = RestOf<NewOrg>;

export type PartialUpdateRestOrg = RestOf<PartialUpdateOrg>;

export type EntityResponseType = HttpResponse<IOrg>;
export type EntityArrayResponseType = HttpResponse<IOrg[]>;

@Injectable({ providedIn: 'root' })
export class OrgService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/orgs');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(org: NewOrg): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(org);
    return this.http.post<RestOrg>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(org: IOrg): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(org);
    return this.http
      .put<RestOrg>(`${this.resourceUrl}/${this.getOrgIdentifier(org)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(org: PartialUpdateOrg): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(org);
    return this.http
      .patch<RestOrg>(`${this.resourceUrl}/${this.getOrgIdentifier(org)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestOrg>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestOrg[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getOrgIdentifier(org: Pick<IOrg, 'id'>): number {
    return org.id;
  }

  compareOrg(o1: Pick<IOrg, 'id'> | null, o2: Pick<IOrg, 'id'> | null): boolean {
    return o1 && o2 ? this.getOrgIdentifier(o1) === this.getOrgIdentifier(o2) : o1 === o2;
  }

  addOrgToCollectionIfMissing<Type extends Pick<IOrg, 'id'>>(orgCollection: Type[], ...orgsToCheck: (Type | null | undefined)[]): Type[] {
    const orgs: Type[] = orgsToCheck.filter(isPresent);
    if (orgs.length > 0) {
      const orgCollectionIdentifiers = orgCollection.map(orgItem => this.getOrgIdentifier(orgItem)!);
      const orgsToAdd = orgs.filter(orgItem => {
        const orgIdentifier = this.getOrgIdentifier(orgItem);
        if (orgCollectionIdentifiers.includes(orgIdentifier)) {
          return false;
        }
        orgCollectionIdentifiers.push(orgIdentifier);
        return true;
      });
      return [...orgsToAdd, ...orgCollection];
    }
    return orgCollection;
  }

  protected convertDateFromClient<T extends IOrg | NewOrg | PartialUpdateOrg>(org: T): RestOf<T> {
    return {
      ...org,
      createdDate: org.createdDate?.toJSON() ?? null,
      lastModifiedDate: org.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restOrg: RestOrg): IOrg {
    return {
      ...restOrg,
      createdDate: restOrg.createdDate ? dayjs(restOrg.createdDate) : undefined,
      lastModifiedDate: restOrg.lastModifiedDate ? dayjs(restOrg.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestOrg>): HttpResponse<IOrg> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestOrg[]>): HttpResponse<IOrg[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
