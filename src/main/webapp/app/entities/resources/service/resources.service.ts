import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IResources, NewResources } from '../resources.model';

export type PartialUpdateResources = Partial<IResources> & Pick<IResources, 'id'>;

type RestOf<T extends IResources | NewResources> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestResources = RestOf<IResources>;

export type NewRestResources = RestOf<NewResources>;

export type PartialUpdateRestResources = RestOf<PartialUpdateResources>;

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
    const copy = this.convertDateFromClient(resources);
    return this.http
      .post<RestResources>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(resources: IResources): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(resources);
    return this.http
      .put<RestResources>(`${this.resourceUrl}/${this.getResourcesIdentifier(resources)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(resources: PartialUpdateResources): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(resources);
    return this.http
      .patch<RestResources>(`${this.resourceUrl}/${this.getResourcesIdentifier(resources)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestResources>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestResources[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
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

  protected convertDateFromClient<T extends IResources | NewResources | PartialUpdateResources>(resources: T): RestOf<T> {
    return {
      ...resources,
      createdDate: resources.createdDate?.toJSON() ?? null,
      lastModifiedDate: resources.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restResources: RestResources): IResources {
    return {
      ...restResources,
      createdDate: restResources.createdDate ? dayjs(restResources.createdDate) : undefined,
      lastModifiedDate: restResources.lastModifiedDate ? dayjs(restResources.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestResources>): HttpResponse<IResources> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestResources[]>): HttpResponse<IResources[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
