import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { StudentComponent } from './list/student.component';
import { StudentDetailComponent } from './detail/student-detail.component';
import { StudentUpdateComponent } from './update/student-update.component';
import StudentResolve from './route/student-routing-resolve.service';

const studentRoute: Routes = [
  {
    path: '',
    component: StudentComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StudentDetailComponent,
    resolve: {
      student: StudentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: StudentUpdateComponent,
    resolve: {
      student: StudentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: StudentUpdateComponent,
    resolve: {
      student: StudentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default studentRoute;
