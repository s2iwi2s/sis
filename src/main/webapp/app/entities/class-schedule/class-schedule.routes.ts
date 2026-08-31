import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import ClassScheduleResolve from './route/class-schedule-routing-resolve.service';

const classScheduleRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/class-schedule').then(m => m.ClassSchedule),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/class-schedule-detail').then(m => m.ClassScheduleDetail),
    resolve: {
      classSchedule: ClassScheduleResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/class-schedule-update').then(m => m.ClassScheduleUpdate),
    resolve: {
      classSchedule: ClassScheduleResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/class-schedule-update').then(m => m.ClassScheduleUpdate),
    resolve: {
      classSchedule: ClassScheduleResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default classScheduleRoute;
