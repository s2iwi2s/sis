import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IGradeLevelPayables, NewGradeLevelPayables } from '../grade-level-payables.model';

export type PartialUpdateGradeLevelPayables = Partial<IGradeLevelPayables> & Pick<IGradeLevelPayables, 'id'>;

@Injectable()
export class GradeLevelPayablesesService {
  readonly gradeLevelPayablesesParams = signal<
    Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined
  >(undefined);
  readonly gradeLevelPayablesesResource = httpResource<IGradeLevelPayables[]>(() => {
    const params = this.gradeLevelPayablesesParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of gradeLevelPayables that have been fetched. It is updated when the gradeLevelPayablesesResource emits a new value.
   * In case of error while fetching the gradeLevelPayableses, the signal is set to an empty array.
   */
  readonly gradeLevelPayableses = computed(() =>
    this.gradeLevelPayablesesResource.hasValue() ? this.gradeLevelPayablesesResource.value() : [],
  );
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/grade-level-payables');
}

@Injectable({ providedIn: 'root' })
export class GradeLevelPayablesService extends GradeLevelPayablesesService {
  protected readonly http = inject(HttpClient);

  create(gradeLevelPayables: NewGradeLevelPayables): Observable<IGradeLevelPayables> {
    return this.http.post<IGradeLevelPayables>(this.resourceUrl, gradeLevelPayables);
  }

  update(gradeLevelPayables: IGradeLevelPayables): Observable<IGradeLevelPayables> {
    return this.http.put<IGradeLevelPayables>(
      `${this.resourceUrl}/${encodeURIComponent(this.getGradeLevelPayablesIdentifier(gradeLevelPayables))}`,
      gradeLevelPayables,
    );
  }

  partialUpdate(gradeLevelPayables: PartialUpdateGradeLevelPayables): Observable<IGradeLevelPayables> {
    return this.http.patch<IGradeLevelPayables>(
      `${this.resourceUrl}/${encodeURIComponent(this.getGradeLevelPayablesIdentifier(gradeLevelPayables))}`,
      gradeLevelPayables,
    );
  }

  find(id: number): Observable<IGradeLevelPayables> {
    return this.http.get<IGradeLevelPayables>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  query(req?: any): Observable<HttpResponse<IGradeLevelPayables[]>> {
    const options = createRequestOption(req);
    return this.http.get<IGradeLevelPayables[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getGradeLevelPayablesIdentifier(gradeLevelPayables: Pick<IGradeLevelPayables, 'id'>): number {
    return gradeLevelPayables.id;
  }

  compareGradeLevelPayables(o1: Pick<IGradeLevelPayables, 'id'> | null, o2: Pick<IGradeLevelPayables, 'id'> | null): boolean {
    return o1 && o2 ? this.getGradeLevelPayablesIdentifier(o1) === this.getGradeLevelPayablesIdentifier(o2) : o1 === o2;
  }

  addGradeLevelPayablesToCollectionIfMissing<Type extends Pick<IGradeLevelPayables, 'id'>>(
    gradeLevelPayablesCollection: Type[],
    ...gradeLevelPayablesesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const gradeLevelPayableses: Type[] = gradeLevelPayablesesToCheck.filter(isPresent);
    if (gradeLevelPayableses.length > 0) {
      const gradeLevelPayablesCollectionIdentifiers = gradeLevelPayablesCollection.map(gradeLevelPayablesItem =>
        this.getGradeLevelPayablesIdentifier(gradeLevelPayablesItem),
      );
      const gradeLevelPayablesesToAdd = gradeLevelPayableses.filter(gradeLevelPayablesItem => {
        const gradeLevelPayablesIdentifier = this.getGradeLevelPayablesIdentifier(gradeLevelPayablesItem);
        if (gradeLevelPayablesCollectionIdentifiers.includes(gradeLevelPayablesIdentifier)) {
          return false;
        }
        gradeLevelPayablesCollectionIdentifiers.push(gradeLevelPayablesIdentifier);
        return true;
      });
      return [...gradeLevelPayablesesToAdd, ...gradeLevelPayablesCollection];
    }
    return gradeLevelPayablesCollection;
  }
}
