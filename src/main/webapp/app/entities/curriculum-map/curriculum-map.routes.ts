import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { CurriculumMapComponent } from './list/curriculum-map.component';
import { CurriculumMapDetailComponent } from './detail/curriculum-map-detail.component';
import { CurriculumMapUpdateComponent } from './update/curriculum-map-update.component';
import CurriculumMapResolve from './route/curriculum-map-routing-resolve.service';

const curriculumMapRoute: Routes = [
  {
    path: '',
    component: CurriculumMapComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CurriculumMapDetailComponent,
    resolve: {
      curriculumMap: CurriculumMapResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CurriculumMapUpdateComponent,
    resolve: {
      curriculumMap: CurriculumMapResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':courseId/:quarterNo/new',
    component: CurriculumMapUpdateComponent,
    resolve: {
      curriculumMap: CurriculumMapResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CurriculumMapUpdateComponent,
    resolve: {
      curriculumMap: CurriculumMapResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default curriculumMapRoute;
