import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { CourseComponent } from './list/course.component';
import { CourseDetailComponent } from './detail/course-detail.component';
import { CourseUpdateComponent } from './update/course-update.component';
import CourseResolve from './route/course-routing-resolve.service';

const courseRoute: Routes = [
  {
    path: '',
    component: CourseComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CourseDetailComponent,
    resolve: {
      course: CourseResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CourseUpdateComponent,
    resolve: {
      course: CourseResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CourseUpdateComponent,
    resolve: {
      course: CourseResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default courseRoute;
