import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { EMPTY, Observable, catchError, of } from 'rxjs';

import { ICourse } from '../course.model';
import { CourseService } from '../service/course.service';

const courseResolve = (route: ActivatedRouteSnapshot): Observable<null | ICourse> => {
  const { id } = route.params;
  if (id) {
    const router = inject(Router);
    const service = inject(CourseService);
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

export default courseResolve;
