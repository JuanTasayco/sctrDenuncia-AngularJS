'use strict';
/* eslint-disable new-cap */

define([], function() {
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
        authorizedResource: [
          'accessSupplier',
          'wpFactory',
          function(accessSupplier, wpFactory) {
            accessSupplier.getAllObject().then(function(resp) {
              wpFactory.setCurrentUser(resp);
            });
          }
        ],
        roleWPUser: [
          'wpFactory',
          function(wpFactory) {
            // HACK: role para detalleAsistencia
            wpFactory.security.GetUserRole().then(function(resp) {
              wpFactory.setRole(resp);
            });
          }
        ]
      },
      resolver: [
        {
          name: 'layout',
          moduleName: 'appWp',
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
        }
      ]
    },
    {
      name: 'filtroAsistencia',
      code: '',
      url: '/filtro-asistencia',
      description: 'Web Procurador',
      parent: 'root',
      views: {
        content: {
          controller: 'FiltroAsistenciaPageController as $ctrl',
          templateUrl: '/webproc/app/components/filtro-asistencia/filtro-asistencia.page.html'
        }
      },
      resolver: [
        {
          name: 'filtroAsistencia',
          moduleName: 'appWp',
          files: ['filtroAsistenciaPageController']
        }
      ]
    },
    {
      name: 'bandeja',
      code: '',
      url: '/',
      params: {
        assistanceNumber: null
      },
      description: 'Bandeja de asistencias',
      parent: 'root',
      views: {
        content: {
          controller: 'BandejaPageController as $ctrl',
          templateUrl: '/webproc/app/components/bandeja/bandeja.page.html'
        }
      },
      resolve: {
        role: [
          'wpFactory',
          function(wpFactory) {
            // HACK: role para componentes de bandeja
            return wpFactory.security.GetUserRole();
          }
        ]
      },
      resolver: [
        {
          name: 'bandeja',
          moduleName: 'appWp',
          files: ['bandejaPageController']
        }
      ]
    },
    {
      name: 'consolidadoAsistencia',
      code: '',
      url: '/consolidado-asistencia',
      description: 'Web Procurador',
      parent: 'root',
      views: {
        content: {
          controller: 'ConsolidadoAsistenciaPageController as $ctrl',
          templateUrl: '/webproc/app/components/consolidado-asistencia/consolidado-asistencia.page.html'
        }
      },
      resolver: [
        {
          name: 'consolidadoAsistencia',
          moduleName: 'appWp',
          files: ['consolidadoAsistenciaPageController']
        }
      ]
    },
    {
      name: 'detalleAsistencia',
      code: '',
      url: '/detalle?:nroAsistencia',
      params: {
        nroAsistencia: null
      },
      description: 'Web Procurador',
      parent: 'root',
      views: {
        content: {
          controller: 'DetalleAsistenciaPageController as $ctrl',
          templateUrl: '/webproc/app/components/detalle-asistencia/detalle-asistencia.page.html'
        }
      },
      resolve: {
        lookups: [
          'wpFactory',
          function lookups(wpFactory) {
            var params = [
              'COD_RESPONSABILIDAD',
              'NIV_EDUCATIVO',
              'TIP_BIEN',
              'TIP_DOMICILIO',
              'TIP_LESION',
              'TIP_LICENCIA',
              'TIP_RELACION',
              'TIP_SOAT',
              'ZONA_DANO'
            ];
            // eslint-disable-next-line new-cap
            return wpFactory.lookup.GetLookupSeveral(params);
          }
        ],
        carTypes: [
          'wpFactory',
          function carTypes(wpFactory) {
            return wpFactory.lookup.GetCarTypes();
          }
        ],
        carBrands: [
          'wpFactory',
          function carBrands(wpFactory) {
            return wpFactory.lookup.GetCarBrands();
          }
        ],
        carTypesUse: [
          'wpFactory',
          function carTypesUse(wpFactory) {
            return wpFactory.lookup.GetCarTypesUse();
          }
        ],
        nivelDanho: [
          'wpFactory',
          function carTypesUse(wpFactory) {
            return wpFactory.severalTable.GetDetails(6, 0);
          }
        ],
        tipoDanho: [
          'wpFactory',
          function tipoDanho(wpFactory) {
            return wpFactory.severalTable.GetDetails(7, 0);
          }
        ],
        talleres: [
          'wpFactory',
          function talleres(wpFactory) {
            return wpFactory.car.Get();
          }
        ],
        typeDocuments: [
          'wpFactory',
          function typeDocuments(wpFactory) {
            return wpFactory.siniestro.GetListParameterDetail(5,undefined,true);
          }
        ],
        dataAsistencia: [
          'wpFactory',
          '$stateParams',
          function(wpFactory, $stateParams) {
            return wpFactory.siniestro.Get($stateParams.nroAsistencia);
          }
        ]
      },
      resolver: [
        {
          name: 'detalleAsistencia',
          moduleName: 'appWp',
          files: ['detalleAsistenciaPageController']
        }
      ]
    },
    //// Antiguo 
    // {
    //   name: 'detalleAsistencia.generales',
    //   code: '',
    //   url: '/generales?:nroAsistencia',
    //   description: 'Datos generales',
    //   views: {
    //     contenido: {
    //       controller: 'DatosGeneralesPageController as $ctrl',
    //       templateUrl: '/webproc/app/components/detalle-asistencia/datos-generales/datos-generales.page.html'
    //     }
    //   },
    //   resolver: [
    //     {
    //       name: 'detalleAsistencia.generales',
    //       moduleName: 'appWp',
    //       files: ['wpDatosGenerales']
    //     }
    //   ]
    // },
    // {
    //   name: 'detalleAsistencia.conductor',
    //   code: '',
    //   url: '/conductor?:nroAsistencia',
    //   description: 'Datos de conductor y ocupante',
    //   views: {
    //     contenido: {
    //       controller: 'ConductorOcupantePageController as $ctrl',
    //       templateUrl: '/webproc/app/components/detalle-asistencia/conductor-ocupante/conductor-ocupante.page.html'
    //     }
    //   },
    //   resolver: [
    //     {
    //       name: 'detalleAsistencia.conductor',
    //       moduleName: 'appWp',
    //       files: ['wpConductorOcupante']
    //     }
    //   ]
    // },
    // {
    //   name: 'detalleAsistencia.vehiculo',
    //   code: '',
    //   url: '/vehiculo?:nroAsistencia',
    //   description: 'Datos del vehículo',
    //   views: {
    //     contenido: {
    //       controller: 'VehiculoPageController as $ctrl',
    //       templateUrl: '/webproc/app/components/detalle-asistencia/vehiculo/vehiculo.page.html'
    //     }
    //   },
    //   resolver: [
    //     {
    //       name: 'detalleAsistencia.vehiculo',
    //       moduleName: 'appWp',
    //       files: ['wpVehiculo']
    //     }
    //   ]
    // },
    // {
    //   name: 'detalleAsistencia.terceros',
    //   code: '',
    //   url: '/terceros?:nroAsistencia',
    //   description: 'Datos del vehículo',
    //   views: {
    //     contenido: {
    //       controller: 'TercerosPageController as $ctrl',
    //       templateUrl: '/webproc/app/components/detalle-asistencia/terceros/terceros.page.html'
    //     }
    //   },
    //   resolver: [
    //     {
    //       name: 'detalleAsistencia.terceros',
    //       moduleName: 'appWp',
    //       files: ['wpTerceros']
    //     }
    //   ]
    // },
    // {
    //   name: 'detalleAsistencia.siniestro',
    //   code: '',
    //   url: '/siniestro?:nroAsistencia',
    //   description: 'Datos del detalle siniestro',
    //   views: {
    //     contenido: {
    //       controller: 'DetalleSiniestroPageController as $ctrl',
    //       templateUrl: '/webproc/app/components/detalle-asistencia/detalle-siniestro/detalle-siniestro.page.html'
    //     }
    //   },
    //   resolver: [
    //     {
    //       name: 'detalleAsistencia.siniestro',
    //       moduleName: 'appWp',
    //       files: ['wpDetalleSiniestro']
    //     }
    //   ]
    // },
    // {
    //   name: 'detalleAsistencia.consolidado',
    //   code: '',
    //   url: '/consolidado?:nroAsistencia',
    //   description: 'Datos del consolidado',
    //   views: {
    //     contenido: {
    //       controller: 'ConsolidadoPageController as $ctrl',
    //       templateUrl: '/webproc/app/components/detalle-asistencia/consolidado/consolidado.page.html'
    //     }
    //   },
    //   resolver: [
    //     {
    //       name: 'detalleAsistencia.consolidado',
    //       moduleName: 'appWp',
    //       files: ['wpConsolidado']
    //     }
    //   ]
    // },
    // {
    //   name: 'detalleAsistencia.talleres',
    //   code: '',
    //   url: '/talleres?:nroAsistencia',
    //   description: 'Búsqueda de talleres',
    //   views: {
    //     contenido: {
    //       controller: 'TalleresPageController as $ctrl',
    //       templateUrl: '/webproc/app/components/detalle-asistencia/talleres/talleres.page.html'
    //     }
    //   },
    //   resolver: [
    //     {
    //       name: 'detalleAsistencia.talleres',
    //       moduleName: 'appWp',
    //       files: ['wpTalleres']
    //     }
    //   ]
    // }
  ];

  return data;
});
