import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IResources, NewResources } from '../resources.model';

export type PartialUpdateResources = Partial<IResources> & Pick<IResources, 'id'>;

export type EntityResponseType = HttpResponse<IResources>;
export type EntityArrayResponseType = HttpResponse<IResources[]>;

@Injectable({ providedIn: 'root' })
export class ResourcesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/resources');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(resources: NewResources): Observable<EntityResponseType> {
    return this.http.post<IResources>(this.resourceUrl, resources, { observe: 'response' });
  }

  update(resources: IResources): Observable<EntityResponseType> {
    return this.http.put<IResources>(`${this.resourceUrl}/${this.getResourcesIdentifier(resources)}`, resources, { observe: 'response' });
  }

  partialUpdate(resources: PartialUpdateResources): Observable<EntityResponseType> {
    return this.http.patch<IResources>(`${this.resourceUrl}/${this.getResourcesIdentifier(resources)}`, resources, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IResources>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IResources[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getResourcesIdentifier(resources: Pick<IResources, 'id'>): number {
    return resources.id;
  }

  compareResources(o1: Pick<IResources, 'id'> | null, o2: Pick<IResources, 'id'> | null): boolean {
    return o1 && o2 ? this.getResourcesIdentifier(o1) === this.getResourcesIdentifier(o2) : o1 === o2;
  }

  addResourcesToCollectionIfMissing<Type extends Pick<IResources, 'id'>>(
    resourcesCollection: Type[],
    ...resourcesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const resources: Type[] = resourcesToCheck.filter(isPresent);
    if (resources.length > 0) {
      const resourcesCollectionIdentifiers = resourcesCollection.map(resourcesItem => this.getResourcesIdentifier(resourcesItem)!);
      const resourcesToAdd = resources.filter(resourcesItem => {
        const resourcesIdentifier = this.getResourcesIdentifier(resourcesItem);
        if (resourcesCollectionIdentifiers.includes(resourcesIdentifier)) {
          return false;
        }
        resourcesCollectionIdentifiers.push(resourcesIdentifier);
        return true;
      });
      return [...resourcesToAdd, ...resourcesCollection];
    }
    return resourcesCollection;
  }
}
