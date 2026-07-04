import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { EMPTY, Observable, catchError, of } from 'rxjs';

import { IInstructor } from '../instructor.model';
import { InstructorService } from '../service/instructor.service';

const instructorResolve = (route: ActivatedRouteSnapshot): Observable<null | IInstructor> => {
  const { id } = route.params;
  if (id) {
    const router = inject(Router);
    const service = inject(InstructorService);
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

export default instructorResolve;
