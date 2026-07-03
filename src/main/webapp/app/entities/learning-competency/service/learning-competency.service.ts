import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { ILearningCompetency, NewLearningCompetency } from '../learning-competency.model';

export type PartialUpdateLearningCompetency = Partial<ILearningCompetency> & Pick<ILearningCompetency, 'id'>;

type RestOf<T extends ILearningCompetency | NewLearningCompetency> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestLearningCompetency = RestOf<ILearningCompetency>;

export type NewRestLearningCompetency = RestOf<NewLearningCompetency>;

export type PartialUpdateRestLearningCompetency = RestOf<PartialUpdateLearningCompetency>;

export type EntityResponseType = HttpResponse<ILearningCompetency>;
export type EntityArrayResponseType = HttpResponse<ILearningCompetency[]>;

@Injectable()
export class LearningCompetenciesService {
  readonly learningCompetenciesParams = signal<
    Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined
  >(undefined);
  readonly learningCompetenciesResource = httpResource<RestLearningCompetency[]>(() => {
    const params = this.learningCompetenciesParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of learningCompetency that have been fetched. It is updated when the learningCompetenciesResource emits a new value.
   * In case of error while fetching the learningCompetencies, the signal is set to an empty array.
   */
  readonly learningCompetencies = computed(() =>
    (this.learningCompetenciesResource.hasValue() ? this.learningCompetenciesResource.value() : []).map(item =>
      this.convertValueFromServer(item),
    ),
  );
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/learning-competencies');

  protected convertValueFromServer(restLearningCompetency: RestLearningCompetency): ILearningCompetency {
    return {
      ...restLearningCompetency,
      createdDate: restLearningCompetency.createdDate ? dayjs(restLearningCompetency.createdDate) : undefined,
      lastModifiedDate: restLearningCompetency.lastModifiedDate ? dayjs(restLearningCompetency.lastModifiedDate) : undefined,
    };
  }
}

@Injectable({ providedIn: 'root' })
export class LearningCompetencyService extends LearningCompetenciesService {
  protected readonly http = inject(HttpClient);

  create(learningCompetency: NewLearningCompetency): Observable<ILearningCompetency> {
    const copy = this.convertValueFromClient(learningCompetency);
    return this.http.post<RestLearningCompetency>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(learningCompetency: ILearningCompetency): Observable<ILearningCompetency> {
    const copy = this.convertValueFromClient(learningCompetency);
    return this.http
      .put<RestLearningCompetency>(
        `${this.resourceUrl}/${encodeURIComponent(this.getLearningCompetencyIdentifier(learningCompetency))}`,
        copy,
      )
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(learningCompetency: PartialUpdateLearningCompetency): Observable<ILearningCompetency> {
    const copy = this.convertValueFromClient(learningCompetency);
    return this.http
      .patch<RestLearningCompetency>(
        `${this.resourceUrl}/${encodeURIComponent(this.getLearningCompetencyIdentifier(learningCompetency))}`,
        copy,
      )
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<ILearningCompetency> {
    return this.http
      .get<RestLearningCompetency>(`${this.resourceUrl}/${encodeURIComponent(id)}`)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<ILearningCompetency[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestLearningCompetency[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  queryByCourse(courseId: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<RestLearningCompetency[]>(`${this.resourceUrl}/${courseId}/course`, { observe: 'response' })
      .pipe(map(res => this.convertHttpResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getLearningCompetencyIdentifier(learningCompetency: Pick<ILearningCompetency, 'id'>): number {
    return learningCompetency.id;
  }

  compareLearningCompetency(o1: Pick<ILearningCompetency, 'id'> | null, o2: Pick<ILearningCompetency, 'id'> | null): boolean {
    return o1 && o2 ? this.getLearningCompetencyIdentifier(o1) === this.getLearningCompetencyIdentifier(o2) : o1 === o2;
  }

  addLearningCompetencyToCollectionIfMissing<Type extends Pick<ILearningCompetency, 'id'>>(
    learningCompetencyCollection: Type[],
    ...learningCompetenciesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const learningCompetencies: Type[] = learningCompetenciesToCheck.filter(isPresent);
    if (learningCompetencies.length > 0) {
      const learningCompetencyCollectionIdentifiers = learningCompetencyCollection.map(learningCompetencyItem =>
        this.getLearningCompetencyIdentifier(learningCompetencyItem),
      );
      const learningCompetenciesToAdd = learningCompetencies.filter(learningCompetencyItem => {
        const learningCompetencyIdentifier = this.getLearningCompetencyIdentifier(learningCompetencyItem);
        if (learningCompetencyCollectionIdentifiers.includes(learningCompetencyIdentifier)) {
          return false;
        }
        learningCompetencyCollectionIdentifiers.push(learningCompetencyIdentifier);
        return true;
      });
      return [...learningCompetenciesToAdd, ...learningCompetencyCollection];
    }
    return learningCompetencyCollection;
  }

  protected convertValueFromClient<T extends ILearningCompetency | NewLearningCompetency | PartialUpdateLearningCompetency>(
    learningCompetency: T,
  ): RestOf<T> {
    return {
      ...learningCompetency,
      createdDate: learningCompetency.createdDate?.toJSON() ?? null,
      lastModifiedDate: learningCompetency.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertResponseFromServer(res: RestLearningCompetency): ILearningCompetency {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestLearningCompetency[]): ILearningCompetency[] {
    return res.map(item => this.convertValueFromServer(item));
  }

  protected convertHttpResponseArrayFromServer(res: HttpResponse<RestLearningCompetency[]>): HttpResponse<ILearningCompetency[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertValueFromServer(item)) : null,
    });
  }
}
