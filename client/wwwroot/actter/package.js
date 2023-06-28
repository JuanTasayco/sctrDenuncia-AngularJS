'use strict';

define(['system'], function(system) {
  var appLocation = system.apps.actter.location;

  return {
    lib: {
      generalConstant: {
        name: 'generalConstant',
        path: appLocation + '/app/common/constants/general.constant'
      },
      proxyActter: {
        name: 'proxyActter',
        path: '/actter/app/proxy/serviceActter'
      },
      appRoutes: {
        name: 'appRoutes',
        path: appLocation + '/app/app.routes'
      },
      app: {
        name: 'app',
        path: appLocation + '/app/app'
      },
      HomeController: {
        name: 'HomeController',
        path: appLocation + '/app/views/home/home.component'
      },
      ClientsController: {
        name: 'ClientsController',
        path: appLocation + '/app/views/clients/clients.component'
      },
      PolizasEditController: {
        name: 'PolizasEditController',
        path: appLocation + '/app/views/polizas/polizas-edit.component'
      },
      ClientEditController: {
        name: 'ClientEditController',
        path: appLocation + '/app/views/clients/client-edit.component'
      },
      companyContact: {
        name: 'companyContact',
        path: appLocation + '/app/common/components/company-contact/company-contact'
      },
      contactForm: {
        name: 'contactForm',
        path: appLocation + '/app/common/components/contact-form/contact-form'
      },
      personalInformation: {
        name: 'personalInformation',
        path: appLocation + '/app/common/components/personal-information/personal-information'
      },
      correspondenceAddress: {
        name: 'correspondenceAddress',
        path: appLocation + '/app/common/components/correspondence-address/correspondence-address'
      },
      officeAddress: {
        name: 'officeAddress',
        path: appLocation + '/app/common/components/office-address/office-address'
      },
      personalAddress: {
        name: 'personalAddress',
        path: appLocation + '/app/common/components/personal-address/personal-address'
      },
      actterFactory: {
        name: 'actterFactory',
        path: appLocation + '/app/factory/actterFactory'
      },
      searchActivity:{
        name:'searchActivity',
        path: appLocation + '/app/common/components/modals/search-activity'
      }
    },
    shim: {
      app: {
        deps: [
          'angular_ui_route',
          'uIBootstrap',
          'oim_ocLazyLoad',
          'oim_layout',
          'lodash',
          'oim_security',
          'wrap_gaia',
          'proxyLogin',
          'proxyActter'
        ],
      },
      proxyActter: { deps: ['wrap_gaia'] }
    },
    packages: {}
  };
});
