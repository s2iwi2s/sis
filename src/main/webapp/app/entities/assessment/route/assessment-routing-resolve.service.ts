import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAssessment } from '../assessment.model';
import { AssessmentService } from '../service/assessment.service';

export const assessmentResolve = (route: ActivatedRouteSnapshot): Observable<null | IAssessment> => {
  const id = route.params['id'];
  if (id) {
    return inject(AssessmentService)
      .find(id)
      .pipe(
        mergeMap((assessment: HttpResponse<IAssessment>) => {
          if (assessment.body) {
            return of(assessment.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default assessmentResolve;
