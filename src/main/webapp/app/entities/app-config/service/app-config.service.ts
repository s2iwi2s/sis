import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IAppConfig, NewAppConfig } from '../app-config.model';

export type PartialUpdateAppConfig = Partial<IAppConfig> & Pick<IAppConfig, 'id'>;

type RestOf<T extends IAppConfig | NewAppConfig> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestAppConfig = RestOf<IAppConfig>;

export type NewRestAppConfig = RestOf<NewAppConfig>;

export type PartialUpdateRestAppConfig = RestOf<PartialUpdateAppConfig>;

@Injectable()
export class AppConfigsService {
  readonly appConfigsParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly appConfigsResource = httpResource<RestAppConfig[]>(() => {
    const params = this.appConfigsParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of appConfig that have been fetched. It is updated when the appConfigsResource emits a new value.
   * In case of error while fetching the appConfigs, the signal is set to an empty array.
   */
  readonly appConfigs = computed(() =>
    (this.appConfigsResource.hasValue() ? this.appConfigsResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/app-configs');

  protected convertValueFromServer(restAppConfig: RestAppConfig): IAppConfig {
    return {
      ...restAppConfig,
      createdDate: restAppConfig.createdDate ? dayjs(restAppConfig.createdDate) : undefined,
      lastModifiedDate: restAppConfig.lastModifiedDate ? dayjs(restAppConfig.lastModifiedDate) : undefined,
    };
  }
}

@Injectable({ providedIn: 'root' })
export class AppConfigService extends AppConfigsService {
  protected readonly http = inject(HttpClient);

  create(appConfig: NewAppConfig): Observable<IAppConfig> {
    const copy = this.convertValueFromClient(appConfig);
    return this.http.post<RestAppConfig>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(appConfig: IAppConfig): Observable<IAppConfig> {
    const copy = this.convertValueFromClient(appConfig);
    return this.http
      .put<RestAppConfig>(`${this.resourceUrl}/${encodeURIComponent(this.getAppConfigIdentifier(appConfig))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(appConfig: PartialUpdateAppConfig): Observable<IAppConfig> {
    const copy = this.convertValueFromClient(appConfig);
    return this.http
      .patch<RestAppConfig>(`${this.resourceUrl}/${encodeURIComponent(this.getAppConfigIdentifier(appConfig))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<IAppConfig> {
    return this.http
      .get<RestAppConfig>(`${this.resourceUrl}/${encodeURIComponent(id)}`)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<IAppConfig[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAppConfig[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getAppConfigIdentifier(appConfig: Pick<IAppConfig, 'id'>): number {
    return appConfig.id;
  }

  compareAppConfig(o1: Pick<IAppConfig, 'id'> | null, o2: Pick<IAppConfig, 'id'> | null): boolean {
    return o1 && o2 ? this.getAppConfigIdentifier(o1) === this.getAppConfigIdentifier(o2) : o1 === o2;
  }

  addAppConfigToCollectionIfMissing<Type extends Pick<IAppConfig, 'id' | 'value' | 'description'>>(
    appConfigCollection: Type[],
    ...appConfigsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const appConfigs: Type[] = appConfigsToCheck.filter(isPresent);
    if (appConfigs.length > 0) {
      const appConfigCollectionIdentifiers = appConfigCollection.map(appConfigItem => this.getAppConfigIdentifier(appConfigItem));
      const appConfigsToAdd = appConfigs.filter(appConfigItem => {
        const appConfigIdentifier = this.getAppConfigIdentifier(appConfigItem);
        if (appConfigCollectionIdentifiers.includes(appConfigIdentifier)) {
          return false;
        }
        appConfigCollectionIdentifiers.push(appConfigIdentifier);
        return true;
      });
      return [...appConfigsToAdd, ...appConfigCollection];
    }
    return appConfigCollection;
  }

  sortAppConfig(appConfigs: IAppConfig[]) {
    const optionsCopy = [...appConfigs];
    return optionsCopy.sort((a, b) => ((a.priority || 0) < (b.priority || 0) ? -1 : 1));
  }

  protected convertValueFromClient<T extends IAppConfig | NewAppConfig | PartialUpdateAppConfig>(appConfig: T): RestOf<T> {
    return {
      ...appConfig,
      createdDate: appConfig.createdDate?.toJSON() ?? null,
      lastModifiedDate: appConfig.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertResponseFromServer(res: RestAppConfig): IAppConfig {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestAppConfig[]): IAppConfig[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
