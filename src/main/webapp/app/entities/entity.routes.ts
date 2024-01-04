import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'org',
    data: { pageTitle: 'schInfoSysApp.org.home.title' },
    loadChildren: () => import('./org/org.routes'),
  },
  {
    path: 'instructor',
    data: { pageTitle: 'schInfoSysApp.instructor.home.title' },
    loadChildren: () => import('./instructor/instructor.routes'),
  },
  {
    path: 'student',
    data: { pageTitle: 'schInfoSysApp.student.home.title' },
    loadChildren: () => import('./student/student.routes'),
  },
  {
    path: 'course',
    data: { pageTitle: 'schInfoSysApp.course.home.title' },
    loadChildren: () => import('./course/course.routes'),
  },
  {
    path: 'app-config',
    data: { pageTitle: 'schInfoSysApp.appConfig.home.title' },
    loadChildren: () => import('./app-config/app-config.routes'),
  },
  {
    path: 'curriculum-map',
    data: { pageTitle: 'schInfoSysApp.curriculumMap.home.title' },
    loadChildren: () => import('./curriculum-map/curriculum-map.routes'),
  },
  {
    path: 'learning-competency',
    data: { pageTitle: 'schInfoSysApp.learningCompetency.home.title' },
    loadChildren: () => import('./learning-competency/learning-competency.routes'),
  },
  {
    path: 'strategies',
    data: { pageTitle: 'schInfoSysApp.strategies.home.title' },
    loadChildren: () => import('./strategies/strategies.routes'),
  },
  {
    path: 'assessment',
    data: { pageTitle: 'schInfoSysApp.assessment.home.title' },
    loadChildren: () => import('./assessment/assessment.routes'),
  },
  {
    path: 'resources',
    data: { pageTitle: 'schInfoSysApp.resources.home.title' },
    loadChildren: () => import('./resources/resources.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
