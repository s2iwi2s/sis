import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { AppConfigComponent } from './list/app-config.component';
import { AppConfigDetailComponent } from './detail/app-config-detail.component';
import { AppConfigUpdateComponent } from './update/app-config-update.component';
import AppConfigResolve from './route/app-config-routing-resolve.service';

const appConfigRoute: Routes = [
  {
    path: '',
    component: AppConfigComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AppConfigDetailComponent,
    resolve: {
      appConfig: AppConfigResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AppConfigUpdateComponent,
    resolve: {
      appConfig: AppConfigResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AppConfigUpdateComponent,
    resolve: {
      appConfig: AppConfigResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default appConfigRoute;
