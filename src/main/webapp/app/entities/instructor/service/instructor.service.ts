import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
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

@Injectable()
export class InstructorsService {
  readonly instructorsParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly instructorsResource = httpResource<RestInstructor[]>(() => {
    const params = this.instructorsParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of instructor that have been fetched. It is updated when the instructorsResource emits a new value.
   * In case of error while fetching the instructors, the signal is set to an empty array.
   */
  readonly instructors = computed(() =>
    (this.instructorsResource.hasValue() ? this.instructorsResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/instructors');

  protected convertValueFromServer(restInstructor: RestInstructor): IInstructor {
    return {
      ...restInstructor,
      hireDate: restInstructor.hireDate ? dayjs(restInstructor.hireDate) : undefined,
      createdDate: restInstructor.createdDate ? dayjs(restInstructor.createdDate) : undefined,
      lastModifiedDate: restInstructor.lastModifiedDate ? dayjs(restInstructor.lastModifiedDate) : undefined,
    };
  }
}

@Injectable({ providedIn: 'root' })
export class InstructorService extends InstructorsService {
  protected readonly http = inject(HttpClient);

  create(instructor: NewInstructor): Observable<IInstructor> {
    const copy = this.convertValueFromClient(instructor);
    return this.http.post<RestInstructor>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(instructor: IInstructor): Observable<IInstructor> {
    const copy = this.convertValueFromClient(instructor);
    return this.http
      .put<RestInstructor>(`${this.resourceUrl}/${encodeURIComponent(this.getInstructorIdentifier(instructor))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(instructor: PartialUpdateInstructor): Observable<IInstructor> {
    const copy = this.convertValueFromClient(instructor);
    return this.http
      .patch<RestInstructor>(`${this.resourceUrl}/${encodeURIComponent(this.getInstructorIdentifier(instructor))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<IInstructor> {
    return this.http
      .get<RestInstructor>(`${this.resourceUrl}/${encodeURIComponent(id)}`)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<IInstructor[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestInstructor[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
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
      const instructorCollectionIdentifiers = instructorCollection.map(instructorItem => this.getInstructorIdentifier(instructorItem));
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

  protected convertValueFromClient<T extends IInstructor | NewInstructor | PartialUpdateInstructor>(instructor: T): RestOf<T> {
    return {
      ...instructor,
      hireDate: instructor.hireDate?.toJSON() ?? null,
      createdDate: instructor.createdDate?.toJSON() ?? null,
      lastModifiedDate: instructor.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertResponseFromServer(res: RestInstructor): IInstructor {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestInstructor[]): IInstructor[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
