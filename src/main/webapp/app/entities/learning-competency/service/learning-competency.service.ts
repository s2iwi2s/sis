import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
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

@Injectable({ providedIn: 'root' })
export class LearningCompetencyService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/learning-competencies');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(learningCompetency: NewLearningCompetency): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(learningCompetency);
    return this.http
      .post<RestLearningCompetency>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(learningCompetency: ILearningCompetency): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(learningCompetency);
    return this.http
      .put<RestLearningCompetency>(`${this.resourceUrl}/${this.getLearningCompetencyIdentifier(learningCompetency)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(learningCompetency: PartialUpdateLearningCompetency): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(learningCompetency);
    return this.http
      .patch<RestLearningCompetency>(`${this.resourceUrl}/${this.getLearningCompetencyIdentifier(learningCompetency)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestLearningCompetency>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestLearningCompetency[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  queryByCourse(courseId: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<RestLearningCompetency[]>(`${this.resourceUrl}/${courseId}/course`, { observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
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
      const learningCompetencyCollectionIdentifiers = learningCompetencyCollection.map(
        learningCompetencyItem => this.getLearningCompetencyIdentifier(learningCompetencyItem)!,
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

  protected convertDateFromClient<T extends ILearningCompetency | NewLearningCompetency | PartialUpdateLearningCompetency>(
    learningCompetency: T,
  ): RestOf<T> {
    return {
      ...learningCompetency,
      createdDate: learningCompetency.createdDate?.toJSON() ?? null,
      lastModifiedDate: learningCompetency.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restLearningCompetency: RestLearningCompetency): ILearningCompetency {
    return {
      ...restLearningCompetency,
      createdDate: restLearningCompetency.createdDate ? dayjs(restLearningCompetency.createdDate) : undefined,
      lastModifiedDate: restLearningCompetency.lastModifiedDate ? dayjs(restLearningCompetency.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestLearningCompetency>): HttpResponse<ILearningCompetency> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestLearningCompetency[]>): HttpResponse<ILearningCompetency[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
