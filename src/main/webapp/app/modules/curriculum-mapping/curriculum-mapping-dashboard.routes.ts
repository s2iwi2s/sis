import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import {
  CurriculumMappingDashboardComponent
} from "./curriculum-mapping-dashboard/curriculum-mapping-dashboard.component";

const curriculumMappingRoute: Routes = [
  {
    path: '',
    component: CurriculumMappingDashboardComponent,
    data: {
      // defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default curriculumMappingRoute;
