import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { EMPTY, Observable, catchError, of } from 'rxjs';

import { IAccountPayables } from '../account-payables.model';
import { AccountPayablesService } from '../service/account-payables.service';

const accountPayablesResolve = (route: ActivatedRouteSnapshot): Observable<null | IAccountPayables> => {
  const { id } = route.params;
  if (id) {
    const router = inject(Router);
    const service = inject(AccountPayablesService);
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

export default accountPayablesResolve;
