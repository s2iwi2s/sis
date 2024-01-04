import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAppConfig, NewAppConfig } from '../app-config.model';

export type PartialUpdateAppConfig = Partial<IAppConfig> & Pick<IAppConfig, 'id'>;

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
    return this.http.post<IAppConfig>(this.resourceUrl, appConfig, { observe: 'response' });
  }

  update(appConfig: IAppConfig): Observable<EntityResponseType> {
    return this.http.put<IAppConfig>(`${this.resourceUrl}/${this.getAppConfigIdentifier(appConfig)}`, appConfig, { observe: 'response' });
  }

  partialUpdate(appConfig: PartialUpdateAppConfig): Observable<EntityResponseType> {
    return this.http.patch<IAppConfig>(`${this.resourceUrl}/${this.getAppConfigIdentifier(appConfig)}`, appConfig, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAppConfig>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAppConfig[]>(this.resourceUrl, { params: options, observe: 'response' });
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
}
