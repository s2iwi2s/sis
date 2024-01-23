import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAppConfig, NewAppConfig } from '../app-config.model';

export type PartialUpdateAppConfig = Partial<IAppConfig> & Pick<IAppConfig, 'id'>;

type RestOf<T extends IAppConfig | NewAppConfig> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestAppConfig = RestOf<IAppConfig>;

export type NewRestAppConfig = RestOf<NewAppConfig>;

export type PartialUpdateRestAppConfig = RestOf<PartialUpdateAppConfig>;

export type EntityResponseType = HttpResponse<IAppConfig>;
export type EntityArrayResponseType = HttpResponse<IAppConfig[]>;

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/app-configs');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(appConfig: NewAppConfig): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(appConfig);
    return this.http
      .post<RestAppConfig>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(appConfig: IAppConfig): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(appConfig);
    return this.http
      .put<RestAppConfig>(`${this.resourceUrl}/${this.getAppConfigIdentifier(appConfig)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(appConfig: PartialUpdateAppConfig): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(appConfig);
    return this.http
      .patch<RestAppConfig>(`${this.resourceUrl}/${this.getAppConfigIdentifier(appConfig)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestAppConfig>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAppConfig[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAppConfigIdentifier(appConfig: Pick<IAppConfig, 'id'>): number {
    return appConfig.id;
  }

  compareAppConfig(o1: Pick<IAppConfig, 'id'> | null, o2: Pick<IAppConfig, 'id'> | null): boolean {
    return o1 && o2 ? this.getAppConfigIdentifier(o1) === this.getAppConfigIdentifier(o2) : o1 === o2;
  }

  addAppConfigToCollectionIfMissing<Type extends Pick<IAppConfig, 'id'>>(
    appConfigCollection: Type[],
    ...appConfigsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const appConfigs: Type[] = appConfigsToCheck.filter(isPresent);
    if (appConfigs.length > 0) {
      const appConfigCollectionIdentifiers = appConfigCollection.map(appConfigItem => this.getAppConfigIdentifier(appConfigItem)!);
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

  protected convertDateFromClient<T extends IAppConfig | NewAppConfig | PartialUpdateAppConfig>(appConfig: T): RestOf<T> {
    return {
      ...appConfig,
      createdDate: appConfig.createdDate?.toJSON() ?? null,
      lastModifiedDate: appConfig.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restAppConfig: RestAppConfig): IAppConfig {
    return {
      ...restAppConfig,
      createdDate: restAppConfig.createdDate ? dayjs(restAppConfig.createdDate) : undefined,
      lastModifiedDate: restAppConfig.lastModifiedDate ? dayjs(restAppConfig.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestAppConfig>): HttpResponse<IAppConfig> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestAppConfig[]>): HttpResponse<IAppConfig[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
