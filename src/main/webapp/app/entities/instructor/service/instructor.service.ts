import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IInstructor, NewInstructor } from '../instructor.model';

export type PartialUpdateInstructor = Partial<IInstructor> & Pick<IInstructor, 'id'>;

type RestOf<T extends IInstructor | NewInstructor> = Omit<T, 'hireDate' | 'createdDate' | 'lastModifiedDate'> & {
  hireDate?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestInstructor = RestOf<IInstructor>;

export type NewRestInstructor = RestOf<NewInstructor>;

export type PartialUpdateRestInstructor = RestOf<PartialUpdateInstructor>;

export type EntityResponseType = HttpResponse<IInstructor>;
export type EntityArrayResponseType = HttpResponse<IInstructor[]>;

@Injectable({ providedIn: 'root' })
export class InstructorService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/instructors');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(instructor: NewInstructor): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(instructor);
    return this.http
      .post<RestInstructor>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(instructor: IInstructor): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(instructor);
    return this.http
      .put<RestInstructor>(`${this.resourceUrl}/${this.getInstructorIdentifier(instructor)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(instructor: PartialUpdateInstructor): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(instructor);
    return this.http
      .patch<RestInstructor>(`${this.resourceUrl}/${this.getInstructorIdentifier(instructor)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestInstructor>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestInstructor[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getInstructorIdentifier(instructor: Pick<IInstructor, 'id'>): number {
    return instructor.id;
  }

  compareInstructor(o1: Pick<IInstructor, 'id'> | null, o2: Pick<IInstructor, 'id'> | null): boolean {
    return o1 && o2 ? this.getInstructorIdentifier(o1) === this.getInstructorIdentifier(o2) : o1 === o2;
  }

  addInstructorToCollectionIfMissing<Type extends Pick<IInstructor, 'id'>>(
    instructorCollection: Type[],
    ...instructorsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const instructors: Type[] = instructorsToCheck.filter(isPresent);
    if (instructors.length > 0) {
      const instructorCollectionIdentifiers = instructorCollection.map(instructorItem => this.getInstructorIdentifier(instructorItem)!);
      const instructorsToAdd = instructors.filter(instructorItem => {
        const instructorIdentifier = this.getInstructorIdentifier(instructorItem);
        if (instructorCollectionIdentifiers.includes(instructorIdentifier)) {
          return false;
        }
        instructorCollectionIdentifiers.push(instructorIdentifier);
        return true;
      });
      return [...instructorsToAdd, ...instructorCollection];
    }
    return instructorCollection;
  }

  protected convertDateFromClient<T extends IInstructor | NewInstructor | PartialUpdateInstructor>(instructor: T): RestOf<T> {
    return {
      ...instructor,
      hireDate: instructor.hireDate?.toJSON() ?? null,
      createdDate: instructor.createdDate?.toJSON() ?? null,
      lastModifiedDate: instructor.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restInstructor: RestInstructor): IInstructor {
    return {
      ...restInstructor,
      hireDate: restInstructor.hireDate ? dayjs(restInstructor.hireDate) : undefined,
      createdDate: restInstructor.createdDate ? dayjs(restInstructor.createdDate) : undefined,
      lastModifiedDate: restInstructor.lastModifiedDate ? dayjs(restInstructor.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestInstructor>): HttpResponse<IInstructor> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestInstructor[]>): HttpResponse<IInstructor[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
