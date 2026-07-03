import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IResources, NewResources } from '../resources.model';

export type PartialUpdateResources = Partial<IResources> & Pick<IResources, 'id'>;

type RestOf<T extends IResources | NewResources> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestResources = RestOf<IResources>;

export type NewRestResources = RestOf<NewResources>;

export type PartialUpdateRestResources = RestOf<PartialUpdateResources>;

@Injectable()
export class ResourcesesService {
  readonly resourcesesParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly resourcesesResource = httpResource<RestResources[]>(() => {
    const params = this.resourcesesParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of resources that have been fetched. It is updated when the resourcesesResource emits a new value.
   * In case of error while fetching the resourceses, the signal is set to an empty array.
   */
  readonly resourceses = computed(() =>
    (this.resourcesesResource.hasValue() ? this.resourcesesResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/resources');

  protected convertValueFromServer(restResources: RestResources): IResources {
    return {
      ...restResources,
      createdDate: restResources.createdDate ? dayjs(restResources.createdDate) : undefined,
      lastModifiedDate: restResources.lastModifiedDate ? dayjs(restResources.lastModifiedDate) : undefined,
    };
  }
}

@Injectable({ providedIn: 'root' })
export class ResourcesService extends ResourcesesService {
  protected readonly http = inject(HttpClient);

  create(resources: NewResources): Observable<IResources> {
    const copy = this.convertValueFromClient(resources);
    return this.http.post<RestResources>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(resources: IResources): Observable<IResources> {
    const copy = this.convertValueFromClient(resources);
    return this.http
      .put<RestResources>(`${this.resourceUrl}/${encodeURIComponent(this.getResourcesIdentifier(resources))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(resources: PartialUpdateResources): Observable<IResources> {
    const copy = this.convertValueFromClient(resources);
    return this.http
      .patch<RestResources>(`${this.resourceUrl}/${encodeURIComponent(this.getResourcesIdentifier(resources))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<IResources> {
    return this.http
      .get<RestResources>(`${this.resourceUrl}/${encodeURIComponent(id)}`)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<IResources[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestResources[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getResourcesIdentifier(resources: Pick<IResources, 'id'>): number {
    return resources.id;
  }

  compareResources(o1: Pick<IResources, 'id'> | null, o2: Pick<IResources, 'id'> | null): boolean {
    return o1 && o2 ? this.getResourcesIdentifier(o1) === this.getResourcesIdentifier(o2) : o1 === o2;
  }

  addResourcesToCollectionIfMissing<Type extends Pick<IResources, 'id'>>(
    resourcesCollection: Type[],
    ...resourcesesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const resourceses: Type[] = resourcesesToCheck.filter(isPresent);
    if (resourceses.length > 0) {
      const resourcesCollectionIdentifiers = resourcesCollection.map(resourcesItem => this.getResourcesIdentifier(resourcesItem));
      const resourcesesToAdd = resourceses.filter(resourcesItem => {
        const resourcesIdentifier = this.getResourcesIdentifier(resourcesItem);
        if (resourcesCollectionIdentifiers.includes(resourcesIdentifier)) {
          return false;
        }
        resourcesCollectionIdentifiers.push(resourcesIdentifier);
        return true;
      });
      return [...resourcesesToAdd, ...resourcesCollection];
    }
    return resourcesCollection;
  }

  protected convertValueFromClient<T extends IResources | NewResources | PartialUpdateResources>(resources: T): RestOf<T> {
    return {
      ...resources,
      createdDate: resources.createdDate?.toJSON() ?? null,
      lastModifiedDate: resources.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertResponseFromServer(res: RestResources): IResources {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestResources[]): IResources[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
