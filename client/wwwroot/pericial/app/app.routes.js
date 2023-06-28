define(['constants', 'constantsPericial'], function (constants, constantsPericial) {
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
        {
          name: "layout",
          moduleName: "appPericial",
          files: ['topController',
            'headerController',
            'menuPericial',
            'cabeceraServicios',
            'leftBarController',
            'bodyMiddelController',
            'bodyLeftController',
            'rightBarController',
            'footerController',
            'bottomController',
            'comentario'
          ]
        }
      ]
    },
    {
      name: 'accessdenied',
      code: '',
      description: 'Acceso denegado',
      url: '/accessDenied',
      parent: 'root',
      views: {
        content: {
          controller: [function() {}],
          templateUrl: '/app/handlerErr/template/access-denied.html'
        }
      }
    },
    {
      name: 'dashboard',
      appCode: 'GPER',
      description: '',
      url: '/',
      parent: 'root',
      views: {
        content: {
          controller: 'DashboardController as dashboardCtrl',
          templateUrl: '/pericial/app/dashboard/controller/dashboard.html'
        }
      },
      resolver:
        [{
          name: 'dashboard',
          moduleName: 'appPericial',
          files: [
            'DashboardController'
          ]
        }]
    },
    {
      name: 'dashboardSupervisor',
      appCode: 'GPER',
      description: '',
      url: '/dashboardSupervisor',
      parent: 'root',
      views: {
        content: {
          controller: 'DashboardSupervisorController as dashboardSupCtrl',
          templateUrl: '/pericial/app/dashboard/controller/dashboardSupervisor.html'
        }
      },
      resolver:
        [{
          name: 'dashboardSupervisor',
          moduleName: 'appPericial',
          files: [
            'DashboardSupervisorController'
          ]
        }]
    },
    {
      name: 'bandejaServicios',
      appCode: 'GPER',
      description: '',
      url: '/bandejaServicios/:type/:executive',
      params: {categoryEntypetityId: 0},
      parent: 'root',
      views: {
        content: {
          controller: 'BandejaServiciosController as bandejaCtrl',
          templateUrl: '/pericial/app/bandejaServicios/controller/bandejaServicios.html'
        }
      },
      resolver:
        [{
          name: 'bandejaServicios',
          moduleName: 'appPericial',
          files: [
            'BandejaServiciosController'
          ]
        }]
    },
    {
      name: 'nuevoRegistro',
      appCode: 'GPER',
      description: '',
      url: '/nuevoRegistro/:idTipoRegistro',
      parent: 'root',
      views: {
        content: {
          controller: 'NuevoRegistroController as nuevoRegistroCtrl',
          templateUrl: '/pericial/app/nuevoRegistro/controller/nuevoRegistro.html'
        }
      },
      resolver:
        [{
          name: 'nuevoRegistro',
          moduleName: 'appPericial',
          files: [
            'NuevoRegistroController'
          ]
        }]
    },
    {
      name: 'reportes',
      appCode: 'GPER',
      description: '',
      url: '/reportes',
      parent: 'root',
      views: {
        content: {
          controller: 'ReportesController as reporteCtrl',
          templateUrl: '/pericial/app/reportes/controller/reportes.html'
        }
      },
      resolver:
        [{
          name: 'reportes',
          moduleName: 'appPericial',
          files: [
            'ReportesController'
          ]
        }]
    },
    {
      name: 'servicioIngresado',
      appCode: 'GPER',
      description: '',
      url: '/servicios/ingresado/:id/:version/:tab',
      params: {categoryEntypetityId: 0},
      parent: 'root',
      views: {
        content: {
          controller: 'ServicioIngresadoController as $ctrl',
          templateUrl: '/pericial/app/servicios/ingresado/controller/ingresado.html'
        }
      },
      resolver:
        [{
          name: 'servicioIngresado',
          moduleName: 'appPericial',
          files: [
            'ServicioIngresadoController'
          ]
        }]
    },
    {
      name: 'servicioIngresadoPT',
      appCode: 'GPER',
      description: '',
      url: '/servicios/ingresadoPT/:id/:version/:tab',
      params: {categoryEntypetityId: 0},
      parent: 'root',
      views: {
        content: {
          controller: 'ServicioIngresadoPTController as $ctrl',
          templateUrl: '/pericial/app/servicios/ingresadoPT/controller/ingresadoPT.html'
        }
      },
      resolver:
        [{
          name: 'servicioIngresadoPT',
          moduleName: 'appPericial',
          files: [
            'ServicioIngresadoPTController'
          ]
        }]
    },
    {
      name: 'servicioPresupuestado',
      appCode: 'GPER',
      description: '',
      url: '/servicios/presupuestado/:id/:version/:tab',
      params: {categoryEntypetityId: 0},
      parent: 'root',
      views: {
        content: {
          controller: 'ServicioPresupuestadoController as $ctrl',
          templateUrl: '/pericial/app/servicios/presupuestado/controller/presupuestado.html'
        }
      },
      resolver:
        [{
          name: 'servicioPresupuestado',
          moduleName: 'appPericial',
          files: [
            'ServicioPresupuestadoController'
          ]
        }]
    },
    {
      name: 'servicioPresupuestadoAmp',
      appCode: 'GPER',
      description: '',
      url: '/servicios/presupuestadoAmp/:id/:version/:tab',
      params: {categoryEntypetityId: 0},
      parent: 'root',
      views: {
        content: {
          controller: 'ServicioPresupuestadoAmpController as $ctrl',
          templateUrl: '/pericial/app/servicios/presupuestadoAmp/controller/presupuestadoAmp.html'
        }
      },
      resolver:
        [{
          name: 'servicioPresupuestadoAmp',
          moduleName: 'appPericial',
          files: [
            'ServicioPresupuestadoAmpController'
          ]
        }]
    },
    {
      name: 'servicioPeritado',
      appCode: 'GPER',
      description: '',
      url: '/servicios/peritado/:id/:version/:tab',
      params: {categoryEntypetityId: 0},
      parent: 'root',
      views: {
        content: {
          controller: 'ServicioPeritadoController as $ctrl',
          templateUrl: '/pericial/app/servicios/peritado/controller/peritado.html'
        }
      },
      resolver:
        [{
          name: 'servicioPeritado',
          moduleName: 'appPericial',
          files: [
            'ServicioPeritadoController'
          ]
        }]
    },
    {
      name: 'servicioEnReparacion',
      appCode: 'GPER',
      description: '',
      url: '/servicios/enReparacion/:id/:version/:tab',
      params: {categoryEntypetityId: 0},
      parent: 'root',
      views: {
        content: {
          controller: 'ServicioEnReparacionController as $ctrl',
          templateUrl: '/pericial/app/servicios/enReparacion/controller/enReparacion.html'
        }
      },
      resolver:
        [{
          name: 'servicioEnReparacion',
          moduleName: 'appPericial',
          files: [
            'ServicioEnReparacionController'
          ]
        }]
    },
    {
      name: 'servicioPorEntregar',
      appCode: 'GPER',
      description: '',
      url: '/servicios/porEntregar/:id/:version/:tab',
      params: {categoryEntypetityId: 0},
      parent: 'root',
      views: {
        content: {
          controller: 'ServicioPorEntregarController as $ctrl',
          templateUrl: '/pericial/app/servicios/porEntregar/controller/porEntregar.html'
        }
      },
      resolver:
        [{
          name: 'servicioPorEntregar',
          moduleName: 'appPericial',
          files: [
            'ServicioPorEntregarController'
          ]
        }]
    },
    {
      name: 'servicioPorEntregarPR',
      appCode: 'GPER',
      description: '',
      url: '/servicios/porEntregarPR/:id/:version/:tab',
      params: {categoryEntypetityId: 0},
      parent: 'root',
      views: {
        content: {
          controller: 'ServicioPorEntregarPRController as $ctrl',
          templateUrl: '/pericial/app/servicios/porEntregarPR/controller/porEntregarPR.html'
        }
      },
      resolver:
        [{
          name: 'servicioPorEntregarPR',
          moduleName: 'appPericial',
          files: [
            'ServicioPorEntregarPRController'
          ]
        }]
    },
    {
      name: 'servicioPresupuestadoVirt',
      appCode: 'GPER',
      description: '',
      url: '/servicios/presupuestadoVirt/:id/:version/:tab',
      params: {categoryEntypetityId: 0},
      parent: 'root',
      views: {
        content: {
          controller: 'ServicioPresupuestadoVirtController as $ctrl',
          templateUrl: '/pericial/app/servicios/presupuestadoVirt/controller/presupuestadoVirt.html'
        }
      },
      resolver:
        [{
          name: 'servicioPresupuestadoVirt',
          moduleName: 'appPericial',
          files: [
            'ServicioPresupuestadoVirtController'
          ]
        }]
    },
    {
      name: 'servicioPresupuestadoAsign',
      appCode: 'GPER',
      description: '',
      url: '/servicios/presupuestadoAsign/:id/:version/:tab',
      params: {categoryEntypetityId: 0},
      parent: 'root',
      views: {
        content: {
          controller: 'ServicioPresupuestadoAsignController as $ctrl',
          templateUrl: '/pericial/app/servicios/presupuestadoAsign/controller/presupuestadoAsign.html'
        }
      },
      resolver:
        [{
          name: 'servicioPresupuestadoAsign',
          moduleName: 'appPericial',
          files: [
            'ServicioPresupuestadoAsignController'
          ]
        }]
    },
    {
      name: 'servicioPresupuestadoZone',
      appCode: 'GPER',
      description: '',
      url: '/servicios/presupuestadoZone/:id/:version/:tab',
      params: {categoryEntypetityId: 0},
      parent: 'root',
      views: {
        content: {
          controller: 'ServicioPresupuestadoZoneController as $ctrl',
          templateUrl: '/pericial/app/servicios/presupuestadoZone/controller/presupuestadoZone.html'
        }
      },
      resolver:
        [{
          name: 'servicioPresupuestadoZone',
          moduleName: 'appPericial',
          files: [
            'ServicioPresupuestadoZoneController'
          ]
        }]
    },
    {
      name: 'servicioPeritajePar',
      appCode: 'GPER',
      description: '',
      url: '/servicios/peritajePar/:id/:version/:tab',
      params: {categoryEntypetityId: 0},
      parent: 'root',
      views: {
        content: {
          controller: 'ServicioPeritajeParController as $ctrl',
          templateUrl: '/pericial/app/servicios/peritajePar/controller/peritajePar.html'
        }
      },
      resolver:
        [{
          name: 'servicioPeritajePar',
          moduleName: 'appPericial',
          files: [
            'ServicioPeritajeParController'
          ]
        }]
    },
    {
      name: 'servicioSupervisorPT',
      // code: '',
      appCode: 'GPER',
      description: '',
      url: '/servicios/supervisorPT/:id/:version/:tab',
      params: {categoryEntypetityId: 0},
      parent: 'root',
      views: {
        content: {
          controller: 'ServicioSupervisorPTController as $ctrl',
          templateUrl: '/pericial/app/servicios/supervisorPT/controller/supervisorPT.html'
        }
      },
      resolver:
        [{
          name: 'servicioSupervisorPT',
          moduleName: 'appPericial',
          files: [
            'ServicioSupervisorPTController'
          ]
        }]
    }
  ];

  return data;
});
