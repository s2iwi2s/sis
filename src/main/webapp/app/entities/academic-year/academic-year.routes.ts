import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import AcademicYearResolve from './route/academic-year-routing-resolve.service';

const academicYearRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/academic-year').then(m => m.AcademicYear),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/academic-year-detail').then(m => m.AcademicYearDetail),
    resolve: {
      academicYear: AcademicYearResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/academic-year-update').then(m => m.AcademicYearUpdate),
    resolve: {
      academicYear: AcademicYearResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/academic-year-update').then(m => m.AcademicYearUpdate),
    resolve: {
      academicYear: AcademicYearResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default academicYearRoute;
