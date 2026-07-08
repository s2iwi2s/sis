import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import StudentResolve from './route/student-routing-resolve.service';

const studentRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/student').then(m => m.Student),
    data: {
      defaultSort: `lastName,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/student-detail').then(m => m.StudentDetail),
    resolve: {
      student: StudentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new/:source',
    loadComponent: () => import('./update/student-update').then(m => m.StudentUpdate),
    resolve: {
      student: StudentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit/:source',
    loadComponent: () => import('./update/student-update').then(m => m.StudentUpdate),
    resolve: {
      student: StudentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default studentRoute;
