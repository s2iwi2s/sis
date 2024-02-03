import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import {
  CurriculumMappingDashboardComponent
} from "./curriculum-mapping-dashboard/curriculum-mapping-dashboard.component";
import {
  CurriculumMappingViewComponent
} from "./curriculum-mapping-view/curriculum-mapping-view.component";
import CourseResolve from "../../entities/course/route/course-routing-resolve.service";

const curriculumMappingRoute: Routes = [
  {
    path: '',
    component: CurriculumMappingViewComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'dashboard',
    component: CurriculumMappingDashboardComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'dashboard/:courseId/:quarterNo',
    component: CurriculumMappingDashboardComponent,
    canActivate: [UserRouteAccessService],
    resolve: {
      course: CourseResolve,
    },
  },
];

export default curriculumMappingRoute;
