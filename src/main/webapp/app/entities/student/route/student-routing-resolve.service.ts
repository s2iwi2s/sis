import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { EMPTY, Observable, catchError, of } from 'rxjs';

import { StudentService } from '../service/student.service';
import { IStudent } from '../student.model';

const studentResolve = (route: ActivatedRouteSnapshot): Observable<null | IStudent> => {
  const { id } = route.params;
  if (id) {
    const router = inject(Router);
    const service = inject(StudentService);
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

export default studentResolve;
