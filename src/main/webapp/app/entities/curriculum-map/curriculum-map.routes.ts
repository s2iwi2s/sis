import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import CurriculumMapResolve from './route/curriculum-map-routing-resolve.service';

const curriculumMapRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/curriculum-map').then(m => m.CurriculumMap),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/curriculum-map-detail').then(m => m.CurriculumMapDetail),
    resolve: {
      curriculumMap: CurriculumMapResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/curriculum-map-update').then(m => m.CurriculumMapUpdate),
    resolve: {
      curriculumMap: CurriculumMapResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':courseId/:quarterNo/new',
    loadComponent: () => import('./update/curriculum-map-update').then(m => m.CurriculumMapUpdate),
    resolve: {
      curriculumMap: CurriculumMapResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/curriculum-map-update').then(m => m.CurriculumMapUpdate),
    resolve: {
      curriculumMap: CurriculumMapResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default curriculumMapRoute;
