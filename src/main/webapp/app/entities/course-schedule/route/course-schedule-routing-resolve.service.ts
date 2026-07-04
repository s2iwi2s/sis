import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { EMPTY, Observable, catchError, of } from 'rxjs';

import { ICourseSchedule } from '../course-schedule.model';
import { CourseScheduleService } from '../service/course-schedule.service';

const courseScheduleResolve = (route: ActivatedRouteSnapshot): Observable<null | ICourseSchedule> => {
  const { id } = route.params;
  if (id) {
    const router = inject(Router);
    const service = inject(CourseScheduleService);
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

export default courseScheduleResolve;
