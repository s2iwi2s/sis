import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ResourcesComponent } from './list/resources.component';
import { ResourcesDetailComponent } from './detail/resources-detail.component';
import { ResourcesUpdateComponent } from './update/resources-update.component';
import ResourcesResolve from './route/resources-routing-resolve.service';

const resourcesRoute: Routes = [
  {
    path: '',
    component: ResourcesComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ResourcesDetailComponent,
    resolve: {
      resources: ResourcesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ResourcesUpdateComponent,
    resolve: {
      resources: ResourcesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ResourcesUpdateComponent,
    resolve: {
      resources: ResourcesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default resourcesRoute;
