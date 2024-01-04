import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { StrategiesComponent } from './list/strategies.component';
import { StrategiesDetailComponent } from './detail/strategies-detail.component';
import { StrategiesUpdateComponent } from './update/strategies-update.component';
import StrategiesResolve from './route/strategies-routing-resolve.service';

const strategiesRoute: Routes = [
  {
    path: '',
    component: StrategiesComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StrategiesDetailComponent,
    resolve: {
      strategies: StrategiesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: StrategiesUpdateComponent,
    resolve: {
      strategies: StrategiesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: StrategiesUpdateComponent,
    resolve: {
      strategies: StrategiesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default strategiesRoute;
