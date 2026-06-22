import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { LearningCompetencyComponent } from './list/learning-competency.component';
import { LearningCompetencyDetailComponent } from './detail/learning-competency-detail.component';
import { LearningCompetencyUpdateComponent } from './update/learning-competency-update.component';
import LearningCompetencyResolve from './route/learning-competency-routing-resolve.service';

const learningCompetencyRoute: Routes = [
  {
    path: '',
    component: LearningCompetencyComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LearningCompetencyDetailComponent,
    resolve: {
      learningCompetency: LearningCompetencyResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LearningCompetencyUpdateComponent,
    resolve: {
      learningCompetency: LearningCompetencyResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':curriculumMapId/new',
    component: LearningCompetencyUpdateComponent,
    resolve: {
      learningCompetency: LearningCompetencyResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LearningCompetencyUpdateComponent,
    resolve: {
      learningCompetency: LearningCompetencyResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default learningCompetencyRoute;
