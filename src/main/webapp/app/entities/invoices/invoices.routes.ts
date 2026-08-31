import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import InvoicesResolve from './route/invoices-routing-resolve.service';

const invoicesRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/invoices').then(m => m.Invoices),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/invoices-detail').then(m => m.InvoicesDetail),
    resolve: {
      invoices: InvoicesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/invoices-update').then(m => m.InvoicesUpdate),
    resolve: {
      invoices: InvoicesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/invoices-update').then(m => m.InvoicesUpdate),
    resolve: {
      invoices: InvoicesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default invoicesRoute;
