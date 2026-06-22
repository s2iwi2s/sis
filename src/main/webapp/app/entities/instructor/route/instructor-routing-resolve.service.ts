import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IInstructor } from '../instructor.model';
import { InstructorService } from '../service/instructor.service';

export const instructorResolve = (route: ActivatedRouteSnapshot): Observable<null | IInstructor> => {
  const id = route.params['id'];
  if (id) {
    return inject(InstructorService)
      .find(id)
      .pipe(
        mergeMap((instructor: HttpResponse<IInstructor>) => {
          if (instructor.body) {
            return of(instructor.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default instructorResolve;
