import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import AppConfigResolve from './route/app-config-routing-resolve.service';

const appConfigRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/app-config').then(m => m.AppConfig),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/app-config-detail').then(m => m.AppConfigDetail),
    resolve: {
      appConfig: AppConfigResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/app-config-update').then(m => m.AppConfigUpdate),
    resolve: {
      appConfig: AppConfigResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/app-config-update').then(m => m.AppConfigUpdate),
    resolve: {
      appConfig: AppConfigResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default appConfigRoute;
