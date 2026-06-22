import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { InstructorComponent } from './list/instructor.component';
import { InstructorDetailComponent } from './detail/instructor-detail.component';
import { InstructorUpdateComponent } from './update/instructor-update.component';
import InstructorResolve from './route/instructor-routing-resolve.service';

const instructorRoute: Routes = [
  {
    path: '',
    component: InstructorComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InstructorDetailComponent,
    resolve: {
      instructor: InstructorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InstructorUpdateComponent,
    resolve: {
      instructor: InstructorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: InstructorUpdateComponent,
    resolve: {
      instructor: InstructorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default instructorRoute;
