import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import AccountPayablesResolve from './route/account-payables-routing-resolve.service';

const accountPayablesRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/account-payables').then(m => m.AccountPayables),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/account-payables-detail').then(m => m.AccountPayablesDetail),
    resolve: {
      accountPayables: AccountPayablesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/account-payables-update').then(m => m.AccountPayablesUpdate),
    resolve: {
      accountPayables: AccountPayablesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/account-payables-update').then(m => m.AccountPayablesUpdate),
    resolve: {
      accountPayables: AccountPayablesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default accountPayablesRoute;
