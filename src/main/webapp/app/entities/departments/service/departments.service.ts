import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { IDepartments, NewDepartments } from '../departments.model';

export type PartialUpdateDepartments = Partial<IDepartments> & Pick<IDepartments, 'id'>;

type RestOf<T extends IDepartments | NewDepartments> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestDepartments = RestOf<IDepartments>;

export type NewRestDepartments = RestOf<NewDepartments>;

export type PartialUpdateRestDepartments = RestOf<PartialUpdateDepartments>;

@Injectable()
export class DepartmentsesService {
  readonly departmentsesParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly departmentsesResource = httpResource<RestDepartments[]>(() => {
    const params = this.departmentsesParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of departments that have been fetched. It is updated when the departmentsesResource emits a new value.
   * In case of error while fetching the departmentses, the signal is set to an empty array.
   */
  readonly departmentses = computed(() =>
    (this.departmentsesResource.hasValue() ? this.departmentsesResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/departments');

  protected convertValueFromServer(restDepartments: RestDepartments): IDepartments {
    return {
      ...restDepartments,
      createdDate: restDepartments.createdDate ? dayjs(restDepartments.createdDate) : undefined,
      lastModifiedDate: restDepartments.lastModifiedDate ? dayjs(restDepartments.lastModifiedDate) : undefined,
    };
  }
}

@Injectable({ providedIn: 'root' })
export class DepartmentsService extends DepartmentsesService {
  protected readonly http = inject(HttpClient);

  create(departments: NewDepartments): Observable<IDepartments> {
    const copy = this.convertValueFromClient(departments);
    return this.http.post<RestDepartments>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(departments: IDepartments): Observable<IDepartments> {
    const copy = this.convertValueFromClient(departments);
    return this.http
      .put<RestDepartments>(`${this.resourceUrl}/${encodeURIComponent(this.getDepartmentsIdentifier(departments))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(departments: PartialUpdateDepartments): Observable<IDepartments> {
    const copy = this.convertValueFromClient(departments);
    return this.http
      .patch<RestDepartments>(`${this.resourceUrl}/${encodeURIComponent(this.getDepartmentsIdentifier(departments))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<IDepartments> {
    return this.http
      .get<RestDepartments>(`${this.resourceUrl}/${encodeURIComponent(id)}`)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<IDepartments[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestDepartments[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getDepartmentsIdentifier(departments: Pick<IDepartments, 'id'>): number {
    return departments.id;
  }

  compareDepartments(o1: Pick<IDepartments, 'id'> | null, o2: Pick<IDepartments, 'id'> | null): boolean {
    return o1 && o2 ? this.getDepartmentsIdentifier(o1) === this.getDepartmentsIdentifier(o2) : o1 === o2;
  }

  addDepartmentsToCollectionIfMissing<Type extends Pick<IDepartments, 'id'>>(
    departmentsCollection: Type[],
    ...departmentsesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const departmentses: Type[] = departmentsesToCheck.filter(isPresent);
    if (departmentses.length > 0) {
      const departmentsCollectionIdentifiers = departmentsCollection.map(departmentsItem => this.getDepartmentsIdentifier(departmentsItem));
      const departmentsesToAdd = departmentses.filter(departmentsItem => {
        const departmentsIdentifier = this.getDepartmentsIdentifier(departmentsItem);
        if (departmentsCollectionIdentifiers.includes(departmentsIdentifier)) {
          return false;
        }
        departmentsCollectionIdentifiers.push(departmentsIdentifier);
        return true;
      });
      return [...departmentsesToAdd, ...departmentsCollection];
    }
    return departmentsCollection;
  }

  protected convertValueFromClient<T extends IDepartments | NewDepartments | PartialUpdateDepartments>(departments: T): RestOf<T> {
    return {
      ...departments,
      createdDate: departments.createdDate?.toJSON() ?? null,
      lastModifiedDate: departments.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertResponseFromServer(res: RestDepartments): IDepartments {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestDepartments[]): IDepartments[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
