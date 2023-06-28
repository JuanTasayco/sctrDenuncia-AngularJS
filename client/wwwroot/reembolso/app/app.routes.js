'use strict';

define([], function () {
  var data = [{
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
        authorizedResource: [
          'accessSupplier',
          function (accessSupplier) {
            accessSupplier.getAllObject();
          }
        ]
      },
      resolver: [{
        name: 'layout',
        moduleName: 'appReembolso',
        files: [
          'topController',
          'headerController',
          'leftBarController',
          'bodyMiddelController',
          'bodyLeftController',
          'rightBarController',
          'footerController',
          'bottomController'
        ]
      }]
    },
    {
      name: 'home',
      code: '',
      url: '/',
      description: '',
      parent: 'root',
      views: {
        content: {
          controller: 'HomeController as $ctrl',
          templateUrl: '/reembolso/app/components/home/home.html'
        }
      },
      resolve: {},
      resolver: [{
        name: 'home',
        moduleName: 'appReembolso',
        files: ['reHome']
      }]
    },
    {
      name: 'solicitud',
      abstract: true,
      code: '',
      url: '/solicitud',
      description: '',
      parent: 'root',
      views: {
        content: {
          controller: 'SolicitudPageController',
          templateUrl: '/reembolso/app/components/solicitud/solicitud.page.html'
        }
      },
      resolve: {},
      resolver: [{
        name: 'solicitud',
        moduleName: 'appReembolso',
        files: ['solicitudPageController']
      }]
    },
    {
      name: 'solicitud.init',
      code: '',
      url: '',
      description: '',
      views: {
        contenido: {
          controller: 'InitSolicitudController as $ctrl',
          templateUrl: '/reembolso/app/components/solicitud/init/init.html'
        }
      },
      resolver: [{
        name: 'solicitud.init',
        moduleName: 'appReembolso',
        files: ['reInitSolicitud']
      }]
    },
    {
      name: 'solicitud.initSteps',
      code: '',
      url: '/pasos',
      thenRoutes: ['/pasos/1'],
      description: '',
      views: {
        contenido: {
          controller: 'ReStepsController as $ctrl',
          templateUrl: '/reembolso/app/components/solicitud/steps/steps.html'
        }
      },
      resolver: [{
        name: 'solicitud.initSteps',
        moduleName: 'appReembolso',
        files: ['reStepsController']
      }]
    },
    {
      name: 'solicitud.initSteps.steps',
      code: '',
      url: '/:step',
      description: '',
      views: {
        contenido: {
          template: function ($stateParam) {
            var template = [
              null,
              '<re-step-one-component></re-step-one-component>',
              '<re-step-two-component></re-step-two-component>',
              '<re-step-three-component></re-step-three-component>'
            ];
            return template[$stateParam.step];
          }
        }
      }
    },
    {
      name: 'solicitud.success',
      code: '',
      url: '/success',
      description: '',
      views: {
        contenido: {
          controller: 'SuccessController',
          templateUrl: '/reembolso/app/components/solicitud/success/success.html'
        }
      },
      resolver: [{
        name: 'solicitud.success',
        moduleName: 'appReembolso',
        files: ['successComponent']
      }]
    },
    {
      name: 'consultar',
      abstract: true,
      code: '',
      url: '/consultar',
      parent: 'root',
      views: {
        content: {
          controller: 'ConsultarPageController',
          templateUrl: '/reembolso/app/components/consultar/consultar.page.html'
        }
      },
      resolve: {},
      resolver: [{
        name: 'consultar',
        moduleName: 'appReembolso',
        files: ['consultarPageController']
      }]
    },
    {
      name: 'consultar.init',
      code: '',
      url: '',
      description: 'Consultar',
      views: {
        contenido: {
          controller: 'InitConsultarController as $ctrl',
          templateUrl: '/reembolso/app/components/consultar/init/init.html'
        }
      },
      resolver: [{
        name: 'consultar.init',
        moduleName: 'appReembolso',
        files: ['reInitConsultar']
      }]
    },
    {
      name: 'consultar.detail',
      code: '',
      url: '/detalleReembolso',
      description: 'Detalle',
      breads: ['consultar.init'],
      params: {
        data: null
      },
      views: {
        contenido: {
          controller: 'InitDetailReembolsoController as $ctrl',
          templateUrl: '/reembolso/app/components/consultar/details/details.html'
        }
      },
      resolver: [{
        name: 'consultar.detail',
        moduleName: 'appReembolso',
        files: ['reInitDetailReembolso']
      }]
    },
    {
      name: 'asignarBroker',
      abstract: true,
      code: '',
      url: '/asignarBroker',
      description: '',
      parent: 'root',
      views: {
        content: {
          controller: 'AsignarBrokerPageController',
          templateUrl: '/reembolso/app/components/broker/asignarBroker.page.html'
        }
      },
      resolve: {},
      resolver: [{
        name: 'asignarBroker',
        moduleName: 'appReembolso',
        files: ['asignarBrokerPageController']
      }]
    },
    {
      name: 'asignarBroker.init',
      code: '',
      url: '',
      description: '',
      views: {
        contenido: {
          controller: 'InitAsignarBrokerController as $ctrl',
          templateUrl: '/reembolso/app/components/broker/init/init.html'
        }
      },
      resolver: [{
        name: 'asignarBroker.init',
        moduleName: 'appReembolso',
        files: ['reInitAsignarBroker']
      }]
    },
    {
      name: 'reasignarEjecutivo',
      abstract: true,
      code: '',
      url: '/reasignarEjecutivo',
      description: '',
      parent: 'root',
      views: {
        content: {
          controller: 'ReasignarEjecutivoPageController',
          templateUrl: '/reembolso/app/components/ejecutivo/reasignarEjecutivo.page.html'
        }
      },
      resolve: {},
      resolver: [{
        name: 'reasignarEjecutivo',
        moduleName: 'appReembolso',
        files: ['reasignarEjecutivoPageController']
      }]
    },
    {
      name: 'reasignarEjecutivo.init',
      code: '',
      url: '',
      description: '',
      views: {
        contenido: {
          controller: 'InitReasignarEjecutivoController as $ctrl',
          templateUrl: '/reembolso/app/components/ejecutivo/init/init.html'
        }
      },
      resolver: [{
        name: 'reasignarEjecutivo.init',
        moduleName: 'appReembolso',
        files: ['reInitReasignarEjecutivo']
      }]
    },
    {
      name: 'maintenance',
      abstract: true,
      conde: '',
      url: '/maintenance',
      description: '',
      parent: 'root',
      views: {
        content: {
          controller: 'MaintenancePageController',
          templateUrl: '/reembolso/app/components/maintenance/maintenance.page.html'
        }
      },
      resolve: {},
      resolver: [{
        name: 'maintenance',
        moduleName: 'appReembolso',
        files: ['maintenancePageController']
      }]
    },
    {
      name: 'maintenance.init',
      code: '',
      url: '',
      description: '',
      views: {
        contenido: {
          controller: 'InitMaintenanceController as $ctrl',
          templateUrl: '/reembolso/app/components/maintenance/init/init.html'
        }
      },
      resolver: [{
        name: 'maintenance.init',
        moduleName: 'appReembolso',
        files: ['reInitMaintenance']
      }]
    },
  ];

  return data;
});
