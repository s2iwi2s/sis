import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOrg } from '../org.model';
import { OrgService } from '../service/org.service';

export const orgResolve = (route: ActivatedRouteSnapshot): Observable<null | IOrg> => {
  const id = route.params['id'];
  if (id) {
    return inject(OrgService)
      .find(id)
      .pipe(
        mergeMap((org: HttpResponse<IOrg>) => {
          if (org.body) {
            return of(org.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default orgResolve;
