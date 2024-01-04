import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { OrgComponent } from './list/org.component';
import { OrgDetailComponent } from './detail/org-detail.component';
import { OrgUpdateComponent } from './update/org-update.component';
import OrgResolve from './route/org-routing-resolve.service';

const orgRoute: Routes = [
  {
    path: '',
    component: OrgComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OrgDetailComponent,
    resolve: {
      org: OrgResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OrgUpdateComponent,
    resolve: {
      org: OrgResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OrgUpdateComponent,
    resolve: {
      org: OrgResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default orgRoute;
