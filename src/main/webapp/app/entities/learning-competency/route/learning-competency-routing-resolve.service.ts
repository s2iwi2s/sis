import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILearningCompetency } from '../learning-competency.model';
import { LearningCompetencyService } from '../service/learning-competency.service';

export const learningCompetencyResolve = (route: ActivatedRouteSnapshot): Observable<null | ILearningCompetency> => {
  const id = route.params['id'];
  if (id) {
    return inject(LearningCompetencyService)
      .find(id)
      .pipe(
        mergeMap((learningCompetency: HttpResponse<ILearningCompetency>) => {
          if (learningCompetency.body) {
            return of(learningCompetency.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  const curriculumMapId = route.params['curriculumMapId'];

  if(curriculumMapId) {
    return of({
      id: -1,
      curriculumMap: {
        id: +curriculumMapId
      }
    });
  }
  return of(null);
};

export default learningCompetencyResolve;
