import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import InstructorResolve from './route/instructor-routing-resolve.service';

const instructorRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/instructor').then(m => m.Instructor),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/instructor-detail').then(m => m.InstructorDetail),
    resolve: {
      instructor: InstructorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/instructor-update').then(m => m.InstructorUpdate),
    resolve: {
      instructor: InstructorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/instructor-update').then(m => m.InstructorUpdate),
    resolve: {
      instructor: InstructorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default instructorRoute;
