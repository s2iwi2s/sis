import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import EnrollmentResolve from './route/enrollment-routing-resolve.service';

const enrollmentRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/enrollment').then(m => m.Enrollment),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/enrollment-detail').then(m => m.EnrollmentDetail),
    resolve: {
      enrollment: EnrollmentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/enrollment-update').then(m => m.EnrollmentUpdate),
    resolve: {
      enrollment: EnrollmentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/enrollment-update').then(m => m.EnrollmentUpdate),
    resolve: {
      enrollment: EnrollmentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default enrollmentRoute;
