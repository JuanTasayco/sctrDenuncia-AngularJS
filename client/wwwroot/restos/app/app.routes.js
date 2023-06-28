define(['constants'], function (constants) {
  var data = [
    {
      name: 'root',
      abstract: true,
      views: {
        'top@root': {
          templateUrl: '/app/index/controller/template/top.html',
          controller: 'topController'
        },
        'header@root': {
          templateUrl: '/app/index/controller/template/header.html',
          controller: 'headerController'
        },
        'left_bar@root': {
          templateUrl: '/app/index/controller/template/left_bar.html',
          controller: 'leftBarController'
        },

        'body_left@root': {
          templateUrl: '/app/index/controller/template/body_left.html',
          controller: 'bodyLeftController'
        },
        'right_bar@root': {
          templateUrl: '/app/index/controller/template/right_bar.html',
          controller: 'rightBarController'
        },
        'footer@root': {
          templateUrl: '/app/index/controller/template/footer.html',
          controller: 'footerController'
        },
        'bottom@root': {
          templateUrl: '/app/index/controller/template/bottom.html',
          controller: 'bottomController'
        }
      },
      resolve: {
        authorizedResource : ['accessSupplier', function(accessSupplier){

            return accessSupplier.getAllObject();
        }]
      },
      resolver: [
        // {
        //   name: "automovilHome",
        //   moduleName: "appAutos",
        //   files: ['/polizas/app/autos/autosHome/controller/automovil-home.js'],
        //   resolveTemplate: true
        // },
        {
          name: "layout",
          // moduleName: "oim.layout",
          moduleName: "appNsctr",
          files: ['topController',
            'headerController',
            'leftBarController',
            'bodyMiddelController',
            'bodyLeftController',
            'rightBarController',
            'footerController',
            'bottomController'],
        },
      ]
    },
    {
      name: 'requestTray',
      // code: '',
      appCode: '',
      description: 'Bandeja',
      url: '/?:pag',
      parent: 'root',
      views: {
        content: {
          controller: 'requestTrayController',
          templateUrl: '/restos/app/requestTray/controller/requestTray.html'
        }
      },
      thenRoutes: ['/bandeja?:pag'],
      resolve: {
        allowedStates: ['requestTrayFactory', 'requestTray', function(requestTrayFactory) {
          return requestTrayFactory.getAllowedStates();
        }],
        allowedActions: ['requestTrayFactory', 'requestTray', function(requestTrayFactory) {
          return requestTrayFactory.getAllowedActions();
        }]
      },
      resolver:
        [{
          name: 'requestTray',
          moduleName: 'appRestos',
          files: [
            'requestTrayController'
          ]
        }]
    },
    {
      name: 'newRequest',
      appCode: '',
      description: 'Nueva solicitud',
      url: '/nueva-solicitud',
      parent: 'root',
      views: {
        content: {
          controller: 'newRequestController',
          templateUrl: '/restos/app/newRequest/controller/newRequest.html'
        }
      },
      resolve: {
        params: ['newRequestFactory', 'newRequest', function(newRequestFactory) {
          return newRequestFactory.getParams();
        }]
      },
      resolver: [
        {
          name: 'newRequest',
          moduleName: 'appRestos',
          files: [
            'newRequestController'
          ]
        }
      ]
    },
    {
      name: 'newRequest.step1',
      description: 'Nueva solicitud (paso 1)',
      url: '/1',
      templateUrl: '/restos/app/newRequest/controller/newRequestS1.html',
      params: {
        step: 1
      }
    },
    {
      name: 'newRequest.step2',
      description: 'Nueva solicitud (paso 2)',
      url: '/2',
      templateUrl: '/restos/app/newRequest/controller/newRequestS2.html',
      params: {
        step: 2
      }
    },
    {
      name: 'newRequest.step3',
      description: 'Nueva solicitud (paso 3)',
      url: '/3',
      templateUrl: '/restos/app/newRequest/controller/newRequestS3.html',
      params: {
        step: 3
      }
    },
    {
      name: 'newRequest.step4',
      description: 'Nueva solicitud (paso 4)',
      url: '/4',
      templateUrl: '/restos/app/newRequest/controller/newRequestS4.html',
      params: {
        step: 4
      }
    },
    {
      name: 'details',
      // code: '',
      appCode: '',
      description: 'Detalle solicitud',
      url: '/detalles?:solicitud',
      parent: 'root',
      views: {
        content: {
          controller: 'requestDetailsController',
          templateUrl: '/restos/app/requestDetails/controller/requestDetails.html'
        }
      },
      resolve: {
        requestData: ['requestDetailsFactory', 'details', '$stateParams', function(requestDetailsFactory, details, $stateParams) {
          return requestDetailsFactory.getRequestData($stateParams.solicitud);
        }],
        history: ['requestDetailsFactory', 'details', '$stateParams', function(requestDetailsFactory, details, $stateParams) {
          return requestDetailsFactory.getHistory($stateParams.solicitud);
        }],
        params: ['requestDetailsFactory', 'details', function(requestDetailsFactory) {
          return requestDetailsFactory.getParams();
        }],
        allowedActions: ['requestDetailsFactory', 'details', function(requestDetailsFactory) {
          return requestDetailsFactory.getAllowedActions();
        }],
        allowedStates: ['requestDetailsFactory', 'details', function(requestDetailsFactory) {
          return requestDetailsFactory.getAllowedStates();
        }],
        allowedStatesToUpdate: ['requestDetailsFactory', 'details', function(requestDetailsFactory) {
          return requestDetailsFactory.getAllowedStatesToUpdate();
        }],
        allowedDocuments: ['requestDetailsFactory', 'details', function(requestDetailsFactory) {
          return requestDetailsFactory.getAllowedDocuments();
        }]
      },
      resolver:
        [{
          name: 'details',
          moduleName: 'appRestos',
          files: [
            'requestDetailsController'
          ]
        }]
    },
    {
      name: 'details.generalData',
      description: 'Detalle solicitud',
      url: '/datos-generales',
      params: {
        tab: 'generalData'
      },
      templateUrl: '/restos/app/requestDetails/controller/requestDetails-generalData.html',
    },
    {
      name: 'details.vehicle',
      description: 'Detalle solicitud',
      url: '/vehiculo',
      params: {
        tab: 'vehicle'
      },
      templateUrl: '/restos/app/requestDetails/controller/requestDetails-vehicle.html',
    },
    {
      name: 'details.documents',
      description: 'Detalle solicitud',
      url: '/documentos',
      params: {
        tab: 'documents'
      },
      templateUrl: '/restos/app/requestDetails/controller/requestDetails-documents.html',
    },
    {
      name: 'details.history',
      description: 'Detalle solicitud',
      url: '/historial',
      params: {
        tab: 'history'
      },
      templateUrl: '/restos/app/requestDetails/controller/requestDetails-history.html',
    },
    {
      name: 'details.payments',
      description: 'Detalle solicitud',
      url: '/pagos',
      params: {
        tab: 'payments'
      },
      templateUrl: '/restos/app/requestDetails/controller/requestDetails-payments.html',
    }
  ];

  return data;
});
