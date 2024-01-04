import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOrg, NewOrg } from '../org.model';

export type PartialUpdateOrg = Partial<IOrg> & Pick<IOrg, 'id'>;

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
    return this.http.post<IOrg>(this.resourceUrl, org, { observe: 'response' });
  }

  update(org: IOrg): Observable<EntityResponseType> {
    return this.http.put<IOrg>(`${this.resourceUrl}/${this.getOrgIdentifier(org)}`, org, { observe: 'response' });
  }

  partialUpdate(org: PartialUpdateOrg): Observable<EntityResponseType> {
    return this.http.patch<IOrg>(`${this.resourceUrl}/${this.getOrgIdentifier(org)}`, org, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOrg>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOrg[]>(this.resourceUrl, { params: options, observe: 'response' });
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
}
