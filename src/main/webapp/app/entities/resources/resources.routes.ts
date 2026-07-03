import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import ResourcesResolve from './route/resources-routing-resolve.service';

const resourcesRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/resources').then(m => m.Resources),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/resources-detail').then(m => m.ResourcesDetail),
    resolve: {
      resources: ResourcesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/resources-update').then(m => m.ResourcesUpdate),
    resolve: {
      resources: ResourcesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/resources-update').then(m => m.ResourcesUpdate),
    resolve: {
      resources: ResourcesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default resourcesRoute;
