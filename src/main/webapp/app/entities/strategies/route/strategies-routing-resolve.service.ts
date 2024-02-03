import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IStrategies } from '../strategies.model';
import { StrategiesService } from '../service/strategies.service';

export const strategiesResolve = (route: ActivatedRouteSnapshot): Observable<null | IStrategies> => {
  const id = route.params['id'];
  if (id) {
    return inject(StrategiesService)
      .find(id)
      .pipe(
        mergeMap((strategies: HttpResponse<IStrategies>) => {
          if (strategies.body) {
            return of(strategies.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  const learningCompetencyId = route.params['learningCompetencyId'];
  if(learningCompetencyId){
    return of({
      id: -1,
      learningCompetency: {id: +learningCompetencyId}
    });
  }

  return of(null);
};

export default strategiesResolve;
