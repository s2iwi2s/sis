import NavbarItem from 'app/layouts/navbar/navbar-item.model';

export const ModulesNavbarItems: NavbarItem[] = [
  {
    name: 'CurriculumMappingView',
    route: '/curriculum-mapping-view',
    translationKey: 'global.menu.modules.curriculumMappingView',
  },
  {
    name: 'CurriculumMappingDashboard',
    route: '/curriculum-mapping-dashboard',
    translationKey: 'global.menu.modules.curriculumMappingDashboard',
  },
  {
    name: 'CurriculumMappingDashboard',
    route: '/curriculum-mapping-dashboard/:id',
    translationKey: 'global.menu.modules.curriculumMappingDashboard',
  },
];
