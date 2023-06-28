'use strict';

define(['system', 'appConstant'], function(system, appConstant) {
  var appLocation = system.apps.landing.location;
  var moduleName = appConstant.appModule;

  return [
    {
      abstract: true,
      name: 'root'
    },
    {
      code: '',
      name: 'home',
      description: 'Home',
      parent: 'root',
      url: '/salud/solicitud/:quotationNumber',
      views: {
        content: {
          controller: 'HomeController',
          templateUrl: appLocation + '/app/views/home/home.component.html'
        }
      },
      resolver: [
        {
          name: 'home',
          moduleName: moduleName,
          files: ['HomeController']
        },
      ]
    },
    {
      code: '',
      name: 'quote',
      description: 'Quote',
      urls: [
        {
          url: '/salud/llenadosolicitud/:quotationNumber',
          abstract: true,
          parent: 'root',
          thenRoutes: ['/salud/solicitud/:quotationNumber/1'],
          views: {
            content: {
              controller: 'QuoteController',
              templateUrl: appLocation + '/app/views/quote/quote.component.html'
            }
          }
        },
        {
          name: 'quote.steps',
          url: '/:step',
          templateUrl: function($stateParam) {
            var steps = [
              undefined,
              appLocation + '/app/views/quote/quote-s1/quote-s1.component.html',
              appLocation + '/app/views/quote/quote-s2/quote-s2.component.html',
              appLocation + '/app/views/quote/quote-s3/quote-s3.component.html'
            ];
            return steps[$stateParam.step];
          },
          resolve: {
            saludLists: [
              "loaderSuscripcionP1Controller",
              "quote",
              "$stateParams",
              function(loaderSuscripcionP1Controller, quote, $stateParams) {
                return loaderSuscripcionP1Controller.getLists(true, $stateParams.step);
              }
            ]
          },
          controllerProvider: function($stateParams) {
            var steps = [
              undefined,
              'QuoteS1Controller',
              'QuoteS2Controller',
              'QuoteS3Controller'
            ];
            return steps[$stateParams.step];
          }
        }
      ],
      resolver: [{
        name: 'quote',
        moduleName: moduleName,
        files: [
          'QuoteS1Controller',
          'QuoteS2Controller',
          'QuoteS3Controller',
          'QuoteController'
        ],
        resolveTemplate: true
      }]
    }
  ];
});
