import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAssessment, NewAssessment } from '../assessment.model';

export type PartialUpdateAssessment = Partial<IAssessment> & Pick<IAssessment, 'id'>;

export type EntityResponseType = HttpResponse<IAssessment>;
export type EntityArrayResponseType = HttpResponse<IAssessment[]>;

@Injectable({ providedIn: 'root' })
export class AssessmentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/assessments');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(assessment: NewAssessment): Observable<EntityResponseType> {
    return this.http.post<IAssessment>(this.resourceUrl, assessment, { observe: 'response' });
  }

  update(assessment: IAssessment): Observable<EntityResponseType> {
    return this.http.put<IAssessment>(`${this.resourceUrl}/${this.getAssessmentIdentifier(assessment)}`, assessment, {
      observe: 'response',
    });
  }

  partialUpdate(assessment: PartialUpdateAssessment): Observable<EntityResponseType> {
    return this.http.patch<IAssessment>(`${this.resourceUrl}/${this.getAssessmentIdentifier(assessment)}`, assessment, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAssessment>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAssessment[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAssessmentIdentifier(assessment: Pick<IAssessment, 'id'>): number {
    return assessment.id;
  }

  compareAssessment(o1: Pick<IAssessment, 'id'> | null, o2: Pick<IAssessment, 'id'> | null): boolean {
    return o1 && o2 ? this.getAssessmentIdentifier(o1) === this.getAssessmentIdentifier(o2) : o1 === o2;
  }

  addAssessmentToCollectionIfMissing<Type extends Pick<IAssessment, 'id'>>(
    assessmentCollection: Type[],
    ...assessmentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const assessments: Type[] = assessmentsToCheck.filter(isPresent);
    if (assessments.length > 0) {
      const assessmentCollectionIdentifiers = assessmentCollection.map(assessmentItem => this.getAssessmentIdentifier(assessmentItem)!);
      const assessmentsToAdd = assessments.filter(assessmentItem => {
        const assessmentIdentifier = this.getAssessmentIdentifier(assessmentItem);
        if (assessmentCollectionIdentifiers.includes(assessmentIdentifier)) {
          return false;
        }
        assessmentCollectionIdentifiers.push(assessmentIdentifier);
        return true;
      });
      return [...assessmentsToAdd, ...assessmentCollection];
    }
    return assessmentCollection;
  }
}
