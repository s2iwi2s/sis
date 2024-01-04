import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IStudent } from '../student.model';
import { StudentService } from '../service/student.service';

export const studentResolve = (route: ActivatedRouteSnapshot): Observable<null | IStudent> => {
  const id = route.params['id'];
  if (id) {
    return inject(StudentService)
      .find(id)
      .pipe(
        mergeMap((student: HttpResponse<IStudent>) => {
          if (student.body) {
            return of(student.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default studentResolve;
