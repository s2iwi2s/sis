import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import CourseResolve from './route/course-routing-resolve.service';

const courseRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/course').then(m => m.Course),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/course-detail').then(m => m.CourseDetail),
    resolve: {
      course: CourseResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/course-update').then(m => m.CourseUpdate),
    resolve: {
      course: CourseResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/course-update').then(m => m.CourseUpdate),
    resolve: {
      course: CourseResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default courseRoute;
