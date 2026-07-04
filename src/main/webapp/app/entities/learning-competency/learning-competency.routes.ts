import { Routes } from '@angular/router';

import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import LearningCompetencyResolve from './route/learning-competency-routing-resolve.service';

const learningCompetencyRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/learning-competency').then(m => m.LearningCompetency),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/learning-competency-detail').then(m => m.LearningCompetencyDetail),
    resolve: {
      learningCompetency: LearningCompetencyResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/learning-competency-update').then(m => m.LearningCompetencyUpdate),
    resolve: {
      learningCompetency: LearningCompetencyResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/learning-competency-update').then(m => m.LearningCompetencyUpdate),
    resolve: {
      learningCompetency: LearningCompetencyResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default learningCompetencyRoute;
