import { Routes } from '@angular/router';
import { UserRouteAccessService } from '../core/auth/user-route-access.service';
import studentResolve from 'app/entities/student/route/student-routing-resolve.service';

const routes: Routes = [
  {
    path: 'curriculum-mapping',
    data: { pageTitle: 'schInfoSysApp.curriculumMappingView.home.title' },
    loadChildren: () => import('./curriculum-mapping/curriculum-mapping.routes'),
  },
  {
    path: 'enrollment-form',
    loadComponent: () => import('./enrollment/enrollment-form/enrollment-form').then(m => m.EnrollmentForm),
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'enrollment-form/:id',
    loadComponent: () => import('./enrollment/enrollment-form/enrollment-form').then(m => m.EnrollmentForm),
    resolve: {
      student: studentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default routes;
