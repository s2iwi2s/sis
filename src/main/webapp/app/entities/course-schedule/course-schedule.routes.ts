import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import CourseScheduleResolve from './route/course-schedule-routing-resolve.service';

const courseScheduleRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/course-schedule').then(m => m.CourseSchedule),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/course-schedule-detail').then(m => m.CourseScheduleDetail),
    resolve: {
      courseSchedule: CourseScheduleResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/course-schedule-update').then(m => m.CourseScheduleUpdate),
    resolve: {
      courseSchedule: CourseScheduleResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/course-schedule-update').then(m => m.CourseScheduleUpdate),
    resolve: {
      courseSchedule: CourseScheduleResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default courseScheduleRoute;
