import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
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

@Injectable()
export class AssessmentsService {
  readonly assessmentsParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly assessmentsResource = httpResource<RestAssessment[]>(() => {
    const params = this.assessmentsParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of assessment that have been fetched. It is updated when the assessmentsResource emits a new value.
   * In case of error while fetching the assessments, the signal is set to an empty array.
   */
  readonly assessments = computed(() =>
    (this.assessmentsResource.hasValue() ? this.assessmentsResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/assessments');

  protected convertValueFromServer(restAssessment: RestAssessment): IAssessment {
    return {
      ...restAssessment,
      createdDate: restAssessment.createdDate ? dayjs(restAssessment.createdDate) : undefined,
      lastModifiedDate: restAssessment.lastModifiedDate ? dayjs(restAssessment.lastModifiedDate) : undefined,
    };
  }
}

@Injectable({ providedIn: 'root' })
export class AssessmentService extends AssessmentsService {
  protected readonly http = inject(HttpClient);

  create(assessment: NewAssessment): Observable<IAssessment> {
    const copy = this.convertValueFromClient(assessment);
    return this.http.post<RestAssessment>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(assessment: IAssessment): Observable<IAssessment> {
    const copy = this.convertValueFromClient(assessment);
    return this.http
      .put<RestAssessment>(`${this.resourceUrl}/${encodeURIComponent(this.getAssessmentIdentifier(assessment))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(assessment: PartialUpdateAssessment): Observable<IAssessment> {
    const copy = this.convertValueFromClient(assessment);
    return this.http
      .patch<RestAssessment>(`${this.resourceUrl}/${encodeURIComponent(this.getAssessmentIdentifier(assessment))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<IAssessment> {
    return this.http
      .get<RestAssessment>(`${this.resourceUrl}/${encodeURIComponent(id)}`)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<IAssessment[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAssessment[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  queryByCourse(courseId: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<RestAssessment[]>(`${this.resourceUrl}/${courseId}/course`, { observe: 'response' })
      .pipe(map(res => this.convertHttpResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
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
      const assessmentCollectionIdentifiers = assessmentCollection.map(assessmentItem => this.getAssessmentIdentifier(assessmentItem));
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

  protected convertValueFromClient<T extends IAssessment | NewAssessment | PartialUpdateAssessment>(assessment: T): RestOf<T> {
    return {
      ...assessment,
      createdDate: assessment.createdDate?.toJSON() ?? null,
      lastModifiedDate: assessment.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertResponseFromServer(res: RestAssessment): IAssessment {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestAssessment[]): IAssessment[] {
    return res.map(item => this.convertValueFromServer(item));
  }

  protected convertHttpResponseArrayFromServer(res: HttpResponse<RestAssessment[]>): HttpResponse<IAssessment[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertValueFromServer(item)) : null,
    });
  }
}
