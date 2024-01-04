import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILearningCompetency, NewLearningCompetency } from '../learning-competency.model';

export type PartialUpdateLearningCompetency = Partial<ILearningCompetency> & Pick<ILearningCompetency, 'id'>;

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
    return this.http.post<ILearningCompetency>(this.resourceUrl, learningCompetency, { observe: 'response' });
  }

  update(learningCompetency: ILearningCompetency): Observable<EntityResponseType> {
    return this.http.put<ILearningCompetency>(
      `${this.resourceUrl}/${this.getLearningCompetencyIdentifier(learningCompetency)}`,
      learningCompetency,
      { observe: 'response' },
    );
  }

  partialUpdate(learningCompetency: PartialUpdateLearningCompetency): Observable<EntityResponseType> {
    return this.http.patch<ILearningCompetency>(
      `${this.resourceUrl}/${this.getLearningCompetencyIdentifier(learningCompetency)}`,
      learningCompetency,
      { observe: 'response' },
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILearningCompetency>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILearningCompetency[]>(this.resourceUrl, { params: options, observe: 'response' });
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
}
