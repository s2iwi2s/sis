import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import GradeLevelPayablesResolve from './route/grade-level-payables-routing-resolve.service';

const gradeLevelPayablesRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/grade-level-payables').then(m => m.GradeLevelPayables),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/grade-level-payables-detail').then(m => m.GradeLevelPayablesDetail),
    resolve: {
      gradeLevelPayables: GradeLevelPayablesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/grade-level-payables-update').then(m => m.GradeLevelPayablesUpdate),
    resolve: {
      gradeLevelPayables: GradeLevelPayablesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/grade-level-payables-update').then(m => m.GradeLevelPayablesUpdate),
    resolve: {
      gradeLevelPayables: GradeLevelPayablesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default gradeLevelPayablesRoute;
