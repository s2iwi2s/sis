import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { AssessmentComponent } from './list/assessment.component';
import { AssessmentDetailComponent } from './detail/assessment-detail.component';
import { AssessmentUpdateComponent } from './update/assessment-update.component';
import AssessmentResolve from './route/assessment-routing-resolve.service';

const assessmentRoute: Routes = [
  {
    path: '',
    component: AssessmentComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AssessmentDetailComponent,
    resolve: {
      assessment: AssessmentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AssessmentUpdateComponent,
    resolve: {
      assessment: AssessmentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AssessmentUpdateComponent,
    resolve: {
      assessment: AssessmentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default assessmentRoute;
