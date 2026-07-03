import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'schInfoSysApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
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
    path: 'course-schedule',
    data: { pageTitle: 'schInfoSysApp.courseSchedule.home.title' },
    loadChildren: () => import('./course-schedule/course-schedule.routes'),
  },
  {
    path: 'departments',
    data: { pageTitle: 'schInfoSysApp.departments.home.title' },
    loadChildren: () => import('./departments/departments.routes'),
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
  {
    path: 'academic-year',
    data: { pageTitle: 'schInfoSysApp.academicYear.home.title' },
    loadChildren: () => import('./academic-year/academic-year.routes'),
  },
  {
    path: 'academic-terms',
    data: { pageTitle: 'schInfoSysApp.academicTerms.home.title' },
    loadChildren: () => import('./academic-terms/academic-terms.routes'),
  },
  {
    path: 'user-management',
    data: { pageTitle: 'userManagement.home.title' },
    loadChildren: () => import('./admin/user-management/user-management.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
