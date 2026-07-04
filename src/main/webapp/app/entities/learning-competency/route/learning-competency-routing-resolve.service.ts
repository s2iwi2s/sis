import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { EMPTY, Observable, catchError, of } from 'rxjs';

import { ILearningCompetency } from '../learning-competency.model';
import { LearningCompetencyService } from '../service/learning-competency.service';

const learningCompetencyResolve = (route: ActivatedRouteSnapshot): Observable<null | ILearningCompetency> => {
  const { id } = route.params;
  if (id) {
    const router = inject(Router);
    const service = inject(LearningCompetencyService);
    return service.find(id).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          router.navigate(['404']);
        } else {
          router.navigate(['error']);
        }
        return EMPTY;
      }),
    );
  }

  return of(null);
};

export default learningCompetencyResolve;
