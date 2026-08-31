import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { EMPTY, Observable, catchError, of } from 'rxjs';

import { IClassSchedule } from '../class-schedule.model';
import { ClassScheduleService } from '../service/class-schedule.service';

const classScheduleResolve = (route: ActivatedRouteSnapshot): Observable<null | IClassSchedule> => {
  const { id } = route.params;
  if (id) {
    const router = inject(Router);
    const service = inject(ClassScheduleService);
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

export default classScheduleResolve;
