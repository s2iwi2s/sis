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
    path: 'class-schedule',
    data: { pageTitle: 'schInfoSysApp.classSchedule.home.title' },
    loadChildren: () => import('./class-schedule/class-schedule.routes'),
  },
  {
    path: 'enrollment',
    data: { pageTitle: 'schInfoSysApp.enrollment.home.title' },
    loadChildren: () => import('./enrollment/enrollment.routes'),
  },
  {
    path: 'account-payables',
    data: { pageTitle: 'schInfoSysApp.accountPayables.home.title' },
    loadChildren: () => import('./account-payables/account-payables.routes'),
  },
  {
    path: 'grade-level-payables',
    data: { pageTitle: 'schInfoSysApp.gradeLevelPayables.home.title' },
    loadChildren: () => import('./grade-level-payables/grade-level-payables.routes'),
  },
  {
    path: 'invoices',
    data: { pageTitle: 'schInfoSysApp.invoices.home.title' },
    loadChildren: () => import('./invoices/invoices.routes'),
  },
  {
    path: 'payments',
    data: { pageTitle: 'schInfoSysApp.payments.home.title' },
    loadChildren: () => import('./payments/payments.routes'),
  },
  {
    path: 'user-management',
    data: { pageTitle: 'userManagement.home.title' },
    loadChildren: () => import('./admin/user-management/user-management.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
