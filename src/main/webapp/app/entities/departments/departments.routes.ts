import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import DepartmentsResolve from './route/departments-routing-resolve.service';

const departmentsRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/departments').then(m => m.Departments),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/departments-detail').then(m => m.DepartmentsDetail),
    resolve: {
      departments: DepartmentsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/departments-update').then(m => m.DepartmentsUpdate),
    resolve: {
      departments: DepartmentsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/departments-update').then(m => m.DepartmentsUpdate),
    resolve: {
      departments: DepartmentsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default departmentsRoute;
