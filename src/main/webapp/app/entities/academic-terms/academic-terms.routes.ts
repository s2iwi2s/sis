import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import AcademicTermsResolve from './route/academic-terms-routing-resolve.service';

const academicTermsRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/academic-terms').then(m => m.AcademicTerms),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/academic-terms-detail').then(m => m.AcademicTermsDetail),
    resolve: {
      academicTerms: AcademicTermsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/academic-terms-update').then(m => m.AcademicTermsUpdate),
    resolve: {
      academicTerms: AcademicTermsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/academic-terms-update').then(m => m.AcademicTermsUpdate),
    resolve: {
      academicTerms: AcademicTermsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default academicTermsRoute;
