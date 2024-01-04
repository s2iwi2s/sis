import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IResources } from '../resources.model';
import { ResourcesService } from '../service/resources.service';

export const resourcesResolve = (route: ActivatedRouteSnapshot): Observable<null | IResources> => {
  const id = route.params['id'];
  if (id) {
    return inject(ResourcesService)
      .find(id)
      .pipe(
        mergeMap((resources: HttpResponse<IResources>) => {
          if (resources.body) {
            return of(resources.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default resourcesResolve;
