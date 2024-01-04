import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICurriculumMap } from '../curriculum-map.model';
import { CurriculumMapService } from '../service/curriculum-map.service';

export const curriculumMapResolve = (route: ActivatedRouteSnapshot): Observable<null | ICurriculumMap> => {
  const id = route.params['id'];
  if (id) {
    return inject(CurriculumMapService)
      .find(id)
      .pipe(
        mergeMap((curriculumMap: HttpResponse<ICurriculumMap>) => {
          if (curriculumMap.body) {
            return of(curriculumMap.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default curriculumMapResolve;
