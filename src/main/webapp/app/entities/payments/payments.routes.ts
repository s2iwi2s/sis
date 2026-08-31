import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import PaymentsResolve from './route/payments-routing-resolve.service';

const paymentsRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/payments').then(m => m.Payments),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/payments-detail').then(m => m.PaymentsDetail),
    resolve: {
      payments: PaymentsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/payments-update').then(m => m.PaymentsUpdate),
    resolve: {
      payments: PaymentsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/payments-update').then(m => m.PaymentsUpdate),
    resolve: {
      payments: PaymentsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default paymentsRoute;
