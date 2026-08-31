import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { EMPTY, Observable, catchError, of } from 'rxjs';

import { IGradeLevelPayables } from '../grade-level-payables.model';
import { GradeLevelPayablesService } from '../service/grade-level-payables.service';

const gradeLevelPayablesResolve = (route: ActivatedRouteSnapshot): Observable<null | IGradeLevelPayables> => {
  const { id } = route.params;
  if (id) {
    const router = inject(Router);
    const service = inject(GradeLevelPayablesService);
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

export default gradeLevelPayablesResolve;
