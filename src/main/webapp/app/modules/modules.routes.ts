import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'curriculum-mapping-dashboard',
    data: { pageTitle: 'schInfoSysApp.curriculumMappingDashboard.home.title' },
    loadChildren: () => import('./curriculum-mapping/curriculum-mapping-dashboard.routes'),
  },
];

export default routes;
