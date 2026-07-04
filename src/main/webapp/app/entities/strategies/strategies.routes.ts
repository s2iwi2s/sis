import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import StrategiesResolve from './route/strategies-routing-resolve.service';

const strategiesRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/strategies').then(m => m.Strategies),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/strategies-detail').then(m => m.StrategiesDetail),
    resolve: {
      strategies: StrategiesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/strategies-update').then(m => m.StrategiesUpdate),
    resolve: {
      strategies: StrategiesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/strategies-update').then(m => m.StrategiesUpdate),
    resolve: {
      strategies: StrategiesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default strategiesRoute;
