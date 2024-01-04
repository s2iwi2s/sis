import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICourse } from '../course.model';
import { CourseService } from '../service/course.service';

export const courseResolve = (route: ActivatedRouteSnapshot): Observable<null | ICourse> => {
  const id = route.params['id'];
  if (id) {
    return inject(CourseService)
      .find(id)
      .pipe(
        mergeMap((course: HttpResponse<ICourse>) => {
          if (course.body) {
            return of(course.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default courseResolve;
