import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'curriculum-mapping',
    data: { pageTitle: 'schInfoSysApp.curriculumMappingView.home.title' },
    loadChildren: () => import('./curriculum-mapping/curriculum-mapping.routes'),
  },
];

export default routes;
