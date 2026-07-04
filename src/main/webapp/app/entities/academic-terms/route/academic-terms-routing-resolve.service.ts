import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { EMPTY, Observable, catchError, of } from 'rxjs';

import { IAcademicTerms } from '../academic-terms.model';
import { AcademicTermsService } from '../service/academic-terms.service';

const academicTermsResolve = (route: ActivatedRouteSnapshot): Observable<null | IAcademicTerms> => {
  const { id } = route.params;
  if (id) {
    const router = inject(Router);
    const service = inject(AcademicTermsService);
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

export default academicTermsResolve;
