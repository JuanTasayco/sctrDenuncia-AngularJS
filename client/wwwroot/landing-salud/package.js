'use strict';

define(['system'], function(system) {
  var appLocation = system.apps.landing.location;

  return {
    lib: {
      appConstant: {
        name: 'appConstant',
        path: appLocation + '/app/constants/app.constant'
      },
      landingRoutes: {
        name: 'landingRoutes',
        path: appLocation + '/app/app.routes'
      },
      appLanding: {
        name: 'appLanding',
        path: appLocation + '/app/app'
      },
      HomeController: {
        name: 'HomeController',
        path: appLocation + '/app/views/home/home.component'
      },
      QuoteController: {
        name: 'QuoteController',
        path: appLocation + '/app/views/quote/quote.component'
      },
      QuoteS1Controller: {
        name: 'QuoteS1Controller',
        path: appLocation + '/app/views/quote/quote-s1/quote-s1.component'
      },
      QuoteS2Controller: {
        name: 'QuoteS2Controller',
        path: appLocation + '/app/views/quote/quote-s2/quote-s2.component'
      },
      QuoteS3Controller: {
        name: 'QuoteS3Controller',
        path: appLocation + '/app/views/quote/quote-s3/quote-s3.component'
      },
      proxyPoliza: {
        name: 'proxyPoliza',
        path: '/polizas/app/proxy/servicePoliza'
      },
      saludFactory: {
        name: 'saludFactory',
        path: appLocation + '/app/factory/saludFactory'
      },
      saludSuscripcionFactory: {
        name: 'saludSuscripcionFactory',
        path: appLocation + '/app/factory/saludSuscripcionFactory'
      },
      question: {
        name: 'question',
        path: appLocation + '/app/common/components/question'
      },
      constantsSalud: {
        name: 'constantsSalud',
        path: appLocation + '/app/common/constants'
      },
    },
    shim: {
      appLanding: {
        deps: [
          'angular_ui_route',
          'uIBootstrap',
          'oim_ocLazyLoad',
          'oim_layout',
          'lodash',
          'oim_security',
          'wrap_gaia',
          'proxyPoliza'
          
        ]
      }
    },
    packages: {}
  };
});
