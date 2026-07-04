import { Routes } from '@angular/router';
import { CurriculumMappingDashboardComponent } from './curriculum-mapping/curriculum-mapping-dashboard/curriculum-mapping-dashboard.component';
import { UserRouteAccessService } from '../core/auth/user-route-access.service';

const routes: Routes = [
  {
    path: 'curriculum-mapping',
    data: { pageTitle: 'schInfoSysApp.curriculumMappingView.home.title' },
    loadChildren: () => import('./curriculum-mapping/curriculum-mapping.routes'),
  },
  {
    path: 'enrollment',
    data: { pageTitle: 'schInfoSysApp.student.home.enrollmentTitle' },
    loadChildren: () => import('../entities/student/student.routes'),
  },
];

export default routes;
