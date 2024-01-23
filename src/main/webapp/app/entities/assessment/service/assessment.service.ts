import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAssessment, NewAssessment } from '../assessment.model';

export type PartialUpdateAssessment = Partial<IAssessment> & Pick<IAssessment, 'id'>;

type RestOf<T extends IAssessment | NewAssessment> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestAssessment = RestOf<IAssessment>;

export type NewRestAssessment = RestOf<NewAssessment>;

export type PartialUpdateRestAssessment = RestOf<PartialUpdateAssessment>;

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
    const copy = this.convertDateFromClient(assessment);
    return this.http
      .post<RestAssessment>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(assessment: IAssessment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(assessment);
    return this.http
      .put<RestAssessment>(`${this.resourceUrl}/${this.getAssessmentIdentifier(assessment)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(assessment: PartialUpdateAssessment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(assessment);
    return this.http
      .patch<RestAssessment>(`${this.resourceUrl}/${this.getAssessmentIdentifier(assessment)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestAssessment>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAssessment[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  queryByCourse(courseId: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<RestAssessment[]>(`${this.resourceUrl}/${courseId}/course`, { observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
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

  protected convertDateFromClient<T extends IAssessment | NewAssessment | PartialUpdateAssessment>(assessment: T): RestOf<T> {
    return {
      ...assessment,
      createdDate: assessment.createdDate?.toJSON() ?? null,
      lastModifiedDate: assessment.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restAssessment: RestAssessment): IAssessment {
    return {
      ...restAssessment,
      createdDate: restAssessment.createdDate ? dayjs(restAssessment.createdDate) : undefined,
      lastModifiedDate: restAssessment.lastModifiedDate ? dayjs(restAssessment.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestAssessment>): HttpResponse<IAssessment> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestAssessment[]>): HttpResponse<IAssessment[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
