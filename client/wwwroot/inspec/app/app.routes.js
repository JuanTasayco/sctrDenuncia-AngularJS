'use strict';

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
          'inspecFactory',
          function(accessSupplier, inspecFactory) {
            return accessSupplier.getAllObject().then(function(resp) {
              inspecFactory.setAccessData(resp);
            });
          }
        ]
      },
      resolver: [
        {
          name: 'layout',
          moduleName: 'appInspec',
          files: [
            'topController',
            'headerController',
            'leftBarController',
            'bodyMiddelController',
            'bodyLeftController',
            'rightBarController',
            'footerController',
            'bottomController',
            'mpfTimepicker',
            'inspecOrderBy',
            'inspecVehicleData',
            'inspecActionButton',
            'inspecRequestLabel',
            'inspecEmptyData',
            'ErrorHandlerService',
            'UserService',
            'inspecMenu',
            'titleSection',
            'inspecSchedule',
            'inspecAccessories',
            'inspecAlerts',
            'inspecFactory',
            'inspecUbigeo',
            'inspecContractor',
            'inspecPremium',
            'inspecApplicant',
            'inspecGroupPolize',
            'mpfSearchFilter',
            'inspecPreviewInspection',
            'inspecImagePreview',
            'inspecImagePreviewMultiple',
            'inspecReportResults'
          ]
        }
      ]
    },
    {
      name: 'innerLayout',
      parent: 'root',
      abstract: true,
      views: {
        content: {
          controller: [
            'authorizedResource',
            '$scope',
            function(authorizedResource, $scope) {
              $scope.authorizedResource = authorizedResource;
            }
          ],
          template: '<div class="clearfix"></div>' + '<inspec-menu></inspec-menu>' + '<div ui-view="content"></div>'
        }
      },
      resolve: {
        authorizedResource: [
          'accessSupplier',
          function(accessSupplier) {
            return accessSupplier.getAllObject();
          }
        ]
      }
    },
    {
      name: 'accessdenied',
      code: '',
      url: '/accessdenied',
      parent: 'root',
      views: {
        content: {
          controller: [function() {}],
          templateUrl: '/inspec/app/components/access-denied/access-denied.html'
        }
      }
    },
    {
      name: 'solicitudes',
      code: '',
      url: '/solicitudes',
      description: 'Solicitudes',
      parent: 'innerLayout',
      objMXKey: 'SOLICITUDES|REGINS|REGISTRAR INSPECCION',
      activeMenu: 'solicitudes',
      views: {
        content: {
          template: '<inspec-solicitudes></inspec-solicitudes>'
        }
      },
      resolver: [
        {
          name: 'solicitudes',
          moduleName: 'appInspec',
          files: ['inspecSolicitudes']
        }
      ]
    },
    {
      name: 'solicitudNuevaEspecial',
      url: '/solicitudes/especial',
      description: 'Solicitud nueva especial',
      params: {anchor: 'anchor-1'},
      parent: 'innerLayout',
      activeMenu: 'solicitudes',
      views: {
        // content: {
        //   template: '<inspec-solicitud-nueva-individual></inspec-solicitud-nueva-individual>'
        // }
        content: {
          controller: 'SolicitudNuevaEspecialController as $ctrl',
          templateUrl: '/inspec/app/components/solicitudes/nueva-solicitud-especial/nueva-solicitud-especial.html'
        }
      },
      resolver: [
        {
          name: 'solicitudNuevaEspecial',
          moduleName: 'appInspec',
          files: ['inspecSolicitudNuevaEspecial']
        }
      ]
    },
    {
      name: 'solicitudNuevaEspecial.steps',
      url: '/:step',
      activeMenu: 'solicitudes',
      templateUrl: function($stateParam) {
        var template = [
          null,
          '/inspec/app/components/solicitudes/nueva-solicitud-especial/step-1.html',
          '/inspec/app/components/solicitudes/nueva-solicitud-especial/step-2.html'
        ];
        return template[$stateParam.step];
      }
    },
    {
      name: 'solicitudNuevaIndividual',
      code: '',
      url: '/solicitudes/individual/:quotationNumber',
      description: 'Solicitud nueva individual',
      params: {fromQuotation: true, anchor: 'anchor-1', vehiclePlate: null, requestId: null},
      parent: 'innerLayout',
      activeMenu: 'solicitudes',
      views: {
        // content: {
        //   template: '<inspec-solicitud-nueva-individual></inspec-solicitud-nueva-individual>'
        // }
        content: {
          controller: 'SolicitudNuevaIndividualController as $ctrl',
          templateUrl: '/inspec/app/components/solicitudes/nueva-solicitud-individual/nueva-solicitud-individual.html'
        }
      },
      resolver: [
        {
          name: 'solicitudNuevaIndividual',
          moduleName: 'appInspec',
          files: ['inspecSolicitudNuevaIndividual']
        }
      ]
    },
    {
      name: 'solicitudNuevaIndividual.steps',
      url: '/:step',
      activeMenu: 'solicitudes',
      templateUrl: function($stateParam) {
        var template = [
          null,
          '/inspec/app/components/solicitudes/nueva-solicitud-individual/step-1.html',
          '/inspec/app/components/solicitudes/nueva-solicitud-individual/step-2.html',
          '/inspec/app/components/solicitudes/nueva-solicitud-individual/step-3.html',
          '/inspec/app/components/solicitudes/nueva-solicitud-individual/step-4.html'
        ];
        return template[$stateParam.step];
      }
    },
    {
      name: 'solicitudNuevaFlota',
      code: '',
      url: '/solicitudes/flota',
      activeMenu: 'solicitudes',
      description: 'Solicitud nueva flota',
      params: {anchor: 'anchor-1'},
      parent: 'innerLayout',
      views: {
        content: {
          controller: 'SolicitudNuevaFlotaController as $ctrl',
          templateUrl: '/inspec/app/components/solicitudes/nueva-solicitud-flota/nueva-solicitud-flota.html'
        }
      },
      resolver: [
        {
          name: 'solicitudNuevaFlota',
          moduleName: 'appInspec',
          files: ['inspecSolicitudNuevaFlota']
        }
      ]
    },
    {
      name: 'solicitudNuevaFlota.steps',
      activeMenu: 'solicitudes',
      url: '/:step',
      templateUrl: function($stateParam) {
        var template = [
          null,
          '/inspec/app/components/solicitudes/nueva-solicitud-flota/step-1.html',
          '/inspec/app/components/solicitudes/nueva-solicitud-flota/step-2.html'
        ];
        return template[$stateParam.step];
      }
    },
    {
      name: 'solicitudNuevaSinCotizacionRegular',
      code: '',
      url: '/solicitudes/sin-cotizacion/regular',
      activeMenu: 'solicitudes',
      description: 'Solicitud nueva sin cotizacion',
      params: {anchor: 'anchor-1', data: null, contractor: null},
      parent: 'innerLayout',
      views: {
        content: {
          controller: 'SolicitudNuevaSinCotizacionRegularController as $ctrl',
          templateUrl:
            '/inspec/app/components/solicitudes/nueva-solicitud-sin-cotizacion/nueva-regular/nueva-regular.html'
        }
      },
      resolver: [
        {
          name: 'solicitudNuevaSinCotizacionRegular',
          moduleName: 'appInspec',
          files: ['inspecSolicitudNuevaSinCotizacionRegular']
        }
      ]
    },
    {
      name: 'solicitudNuevaSinCotizacionRegular.steps',
      url: '/:step',
      activeMenu: 'solicitudes',
      templateUrl: function($stateParam) {
        var template = [
          null,
          '/inspec/app/components/solicitudes/nueva-solicitud-sin-cotizacion/nueva-regular/step-1.html',
          '/inspec/app/components/solicitudes/nueva-solicitud-sin-cotizacion/nueva-regular/step-2.html',
          '/inspec/app/components/solicitudes/nueva-solicitud-sin-cotizacion/nueva-regular/step-3.html',
          '/inspec/app/components/solicitudes/nueva-solicitud-sin-cotizacion/nueva-regular/step-4.html'
        ];
        return template[$stateParam.step];
      }
    },
    {
      name: 'solicitudNuevaSinCotizacionReinspeccion',
      code: '',
      url: '/solicitudes/sin-cotizacion/reinspeccion',
      activeMenu: 'solicitudes',
      params: {anchor: 'anchor-1'},
      description: 'Solicitud nueva sin cotizacion',
      parent: 'innerLayout',
      views: {
        content: {
          controller: 'SolicitudNuevaSinCotizacionReinspeccionController as $ctrl',
          templateUrl:
            '/inspec/app/components/solicitudes/nueva-solicitud-sin-cotizacion/nueva-reinspeccion/nueva-reinspeccion.html'
        }
      },
      resolver: [
        {
          name: 'solicitudNuevaSinCotizacionReinspeccion',
          moduleName: 'appInspec',
          files: ['inspecSolicitudNuevaSinCotizacionReinspeccion']
        }
      ]
    },
    {
      name: 'solicitudNuevaSinCotizacionReinspeccion.steps',
      url: '/:step',
      activeMenu: 'solicitudes',
      templateUrl: function($stateParam) {
        var template = [
          null,
          '/inspec/app/components/solicitudes/nueva-solicitud-sin-cotizacion/nueva-reinspeccion/step-1.html',
          '/inspec/app/components/solicitudes/nueva-solicitud-sin-cotizacion/nueva-reinspeccion/step-2.html',
          '/inspec/app/components/solicitudes/nueva-solicitud-sin-cotizacion/nueva-reinspeccion/step-3.html'
        ];
        return template[$stateParam.step];
      }
    },
    {
      name: 'cotizaciones',
      code: '',
      url: '/cotizaciones',
      activeMenu: 'cotizaciones',
      description: 'Cotizaciones',
      parent: 'innerLayout',
      params: {fromInspec: false, fromRequest: false, copyEmail: null, confirmationEmail: null, agent: null},
      objMXKey: 'REGSOL|REGINS',
      views: {
        content: {
          template: '<inspec-cotizaciones></inspec-cotizaciones>'
        }
      },
      resolver: [
        {
          name: 'cotizaciones',
          moduleName: 'appInspec',
          files: ['inspecCotizaciones']
        }
      ]
    },
    {
      name: 'cotizacionesDetalle',
      code: '',
      url: '/cotizaciones/:number',
      activeMenu: 'cotizaciones',
      description: 'Detalle cotización',
      parent: 'innerLayout',
      params: {fromInspec: false, copyEmail: null, confirmationEmail: null, agent: null},
      objMXKey: 'REGSOL|REGINS',
      views: {
        content: {
          // TODO cambiar nombre
          template: '<inspec-cotizaciones-detalle></inspec-cotizaciones-detalle>'
        }
      },
      resolver: [
        {
          name: 'cotizacionesDetalle',
          moduleName: 'appInspec',
          files: ['inspecCotizacionesDetalle']
        }
      ]
    },
    {
      name: 'programaciones',
      code: '',
      url: '/programaciones',
      activeMenu: 'programaciones',
      description: 'Programaciones',
      parent: 'innerLayout',
      objMXKey: 'PROGRAMACION',
      views: {
        content: {
          template: '<inspec-programaciones></inspec-programaciones>'
        }
      },
      resolver: [
        {
          name: 'programaciones',
          moduleName: 'appInspec',
          files: ['inspecProgramaciones']
        }
      ]
    },
    {
      name: 'agenda',
      code: '',
      url: '/agenda',
      activeMenu: 'agenda',
      description: 'Agenda',
      objMXKey: 'AGENDA',
      parent: 'innerLayout',
      views: {
        content: {
          template: '<inspec-agenda></inspec-agenda>'
        }
      },
      resolver: [
        {
          name: 'agenda',
          moduleName: 'appInspec',
          files: ['inspecAgenda']
        }
      ]
    },
    {
      name: 'solicitudesDetalle',
      url: '/solicitudes/:requestId/:riskId',
      activeMenu: 'solicitudes',
      description: 'Detalle Solicitud',
      parent: 'innerLayout',
      params: {tab: null, fromProgram: false, source: null},
      views: {
        content: {
          template: '<inspec-solicitud-detalle></inspec-solicitud-detalle>'
        }
      },
      resolver: [
        {
          name: 'solicitudesDetalle',
          moduleName: 'appInspec',
          files: ['inspecSolicitudDetalle']
        }
      ]
    },
    {
      name: 'programacionDetalle',
      code: '',
      url: '/programaciones/detalle',
      activeMenu: 'programaciones',
      description: 'Programacion Detalle',
      parent: 'innerLayout',
      views: {
        content: {
          controller: 'programacionDetalleController',
          templateUrl: '/inspec/app/programacionDetalle/controller/programacion-detalle.html'
        }
      },
      resolver: [
        {
          name: 'programacionDetalle',
          moduleName: 'appInspec',
          files: ['/inspec/app/programacionDetalle/controller/programacion-detalle-controller.js']
        }
      ]
    },
    {
      name: 'programadaDetalle',
      code: '',
      url: '/programada/detalle',
      activeMenu: 'programaciones',
      description: 'Programada Detalle',
      parent: 'innerLayout',
      views: {
        content: {
          controller: 'programadaDetalleController',
          templateUrl: '/inspec/app/_programadaDetalle/controller/programada-detalle.html'
        }
      },
      resolver: [
        {
          name: 'programadaDetalle',
          moduleName: 'appInspec',
          files: ['/inspec/app/_programadaDetalle/controller/programada-detalle-controller.js']
        }
      ]
    },
    {
      name: 'inspeccionRegistro',
      url: '/inspecciones/registro',
      activeMenu: 'solicitudes',
      description: 'Registro de la Inspección',
      parent: 'innerLayout',
      params: {riskId: null, requestId: null, inspectionId: null, request: null, inspection: null},
      views: {
        content: {
          template: '<inspec-registro-inspeccion></inspec-registro-inspeccion>'
        }
      },
      resolver: [
        {
          name: 'inspeccionRegistro',
          moduleName: 'appInspec',
          files: ['inspecRegistroInspeccion', 'FileReaderService']
        }
      ]
    },
    {
      name: 'inspeccionNueva',
      code: '',
      url: '/inspeccion/nueva/:quotationNumber',
      description: 'Nueva inspección',
      params: {fromQuotation: true, copyEmail: null, confirmationEmail: null, agent: null, anchor: 'anchor-1'},
      parent: 'innerLayout',
      activeMenu: 'solicitudes',
      views: {
        content: {
          controller: 'NuevaInspeccionController as $ctrl',
          templateUrl: '/inspec/app/components/inspecciones/nueva-inspeccion/nueva-inspeccion.html'
        }
      },
      resolver: [
        {
          name: 'inspeccionNueva',
          moduleName: 'appInspec',
          files: ['inspecNuevaInspeccion']
        }
      ]
    },
    {
      name: 'inspeccionNueva.steps',
      url: '/:step',
      activeMenu: 'solicitudes',
      templateUrl: function($stateParam) {
        var template = [
          null,
          '/inspec/app/components/inspecciones/nueva-inspeccion/step-1.html',
          '/inspec/app/components/inspecciones/nueva-inspeccion/step-2.html',
          '/inspec/app/components/inspecciones/nueva-inspeccion/step-3.html',
          '/inspec/app/components/inspecciones/nueva-inspeccion/step-4.html'
        ];
        return template[$stateParam.step];
      }
    },
    {
      name: 'inspeccionNuevaSinCotizacion',
      code: '',
      url: '/inspeccion/sin-cotizacion',
      description: 'Nueva inspección sin cotización',
      params: {copyEmail: null, confirmationEmail: null, agent: null, anchor: 'anchor-1'},
      parent: 'innerLayout',
      activeMenu: 'solicitudes',
      views: {
        content: {
          controller: 'NuevaInspeccionSinCotizacionController as $ctrl',
          templateUrl:
            '/inspec/app/components/inspecciones/nueva-inspeccion-sin-cotizacion/nueva-inspeccion-sin-cotizacion.html'
        }
      },
      resolver: [
        {
          name: 'inspeccionNuevaSinCotizacion',
          moduleName: 'appInspec',
          files: ['inspecNuevaInspeccionSinCotizacion']
        }
      ]
    },
    {
      name: 'inspeccionNuevaSinCotizacion.steps',
      url: '/:step',
      activeMenu: 'solicitudes',
      templateUrl: function($stateParam) {
        var template = [
          null,
          '/inspec/app/components/inspecciones/nueva-inspeccion-sin-cotizacion/step-1.html',
          '/inspec/app/components/inspecciones/nueva-inspeccion-sin-cotizacion/step-2.html',
          '/inspec/app/components/inspecciones/nueva-inspeccion-sin-cotizacion/step-3.html',
          '/inspec/app/components/inspecciones/nueva-inspeccion-sin-cotizacion/step-4.html'
        ];
        return template[$stateParam.step];
      }
    },
    {
      name: 'inspeccionTerminada',
      activeMenu: 'solicitudes',
      url: '/inspecciones/terminada',
      description: 'inspecciones',
      parent: 'innerLayout',
      params: {riskId: null, requestId: null, inspectionId: null},
      views: {
        content: {
          template: '<inspec-terminada></inspec-terminada>'
        }
      },
      resolver: [
        {
          name: 'inspeccionTerminada',
          moduleName: 'appInspec',
          files: ['inspecTerminada']
        }
      ]
    },
    {
      name: 'inspeccionRegistroApp',
      code: '',
      url: '/inspecciones/registro/app',
      activeMenu: 'solicitudes',
      description: 'Inspeccion Registro App',
      parent: 'innerLayout',
      views: {
        content: {
          controller: 'inspeccionRegistroAppController',
          templateUrl: '/inspec/app/inspecciones/controller/inspeccion-registro-app.html'
        }
      },
      resolver: [
        {
          name: 'inspeccionRegistroApp',
          moduleName: 'appInspec',
          files: ['/inspec/app/inspecciones/controller/inspeccion-registro-app-controller.js']
        }
      ]
    },
    {
      name: 'solcitudNuevaSinCotizacion',
      code: '',
      url: '/solicitudes/solictudNueva/sinCotizacion/paso/1',
      activeMenu: 'solicitudes',
      description: 'Solicitud nueva sin contización',
      parent: 'innerLayout',
      views: {
        content: {
          controller: 'solicitudNuevaSinCotizacionPaso1Controller',
          templateUrl: '/inspec/app/solicitudes/controller/solicitud-nueva-sin-cotizacion-p1.html'
        }
      },
      resolver: [
        {
          name: 'solcitudNuevaSinCotizacionPaso1',
          moduleName: 'appInspec',
          files: ['/inspec/app/solicitudes/controller/solicitud-nueva-sin-cotizacion-p1-controller.js']
        }
      ]
    },
    {
      name: 'solcitudNuevaSinCotizacionPaso2',
      code: '',
      url: '/solicitudes/solictudNueva/sinCotizacion/paso/2',
      activeMenu: 'solicitudes',
      description: 'Solicitud nueva sin contización',
      parent: 'innerLayout',
      views: {
        content: {
          controller: 'solicitudNuevaSinCotizacionPaso2Controller',
          templateUrl: '/inspec/app/solicitudes/controller/solicitud-nueva-sin-cotizacion-p2.html'
        }
      },
      resolver: [
        {
          name: 'solcitudNuevaSinCotizacionPaso2',
          moduleName: 'appInspec',
          files: ['/inspec/app/solicitudes/controller/solicitud-nueva-sin-cotizacion-p2-controller.js']
        }
      ]
    },
    {
      name: 'solcitudNuevaSinCotizacionPaso3',
      code: '',
      url: '/solicitudes/solictudNueva/sinCotizacion/paso/3',
      activeMenu: 'solicitudes',
      description: 'Solicitud nueva sin contización',
      parent: 'innerLayout',
      views: {
        content: {
          controller: 'solicitudNuevaSinCotizacionPaso3Controller',
          templateUrl: '/inspec/app/solicitudes/controller/solicitud-nueva-sin-cotizacion-p3.html'
        }
      },
      resolver: [
        {
          name: 'solcitudNuevaSinCotizacionPaso3',
          moduleName: 'appInspec',
          files: ['/inspec/app/solicitudes/controller/solicitud-nueva-sin-cotizacion-p3-controller.js']
        }
      ]
    },
    {
      name: 'polizaEmitida',
      code: '',
      url: '/poliza/emitida',
      activeMenu: 'solicitudes',
      description: 'Poliza Emitida',
      parent: 'innerLayout',
      views: {
        content: {
          controller: 'polizaEmitidaController',
          templateUrl: '/inspec/app/polizaEmitida/controller/poliza-emitida.html'
        }
      },
      resolver: [
        {
          name: 'polizaEmitida',
          moduleName: 'appInspec',
          files: ['/inspec/app/polizaEmitida/controller/poliza-emitida-controller.js']
        }
      ]
    },
    {
      name: 'administracionAutomas',
      code: '',
      url: '/administracion/automas',
      activeMenu: 'administracion',
      description: 'Administración Automas',
      objMXKey: 'AUTOMAS',
      parent: 'innerLayout',
      views: {
        content: {
          template: '<inspec-automas></inspec-automas>'
        }
      },
      resolver: [
        {
          name: 'administracionAutomas',
          moduleName: 'appInspec',
          files: ['inspecAutomas']
        }
      ]
    },
    {
      name: 'administracionReglasAsignacion',
      url: '/administracion/reglas-asignacion',
      activeMenu: 'administracion',
      description: 'Administración Reglas de Asignación',
      objMXKey: 'REGLAS ASIGNACION|REGLAS DE ASIGNACION',
      parent: 'innerLayout',
      views: {
        content: {
          template: '<inspec-asignacion></inspec-asignacion>'
        }
      },
      resolver: [
        {
          name: 'administracionReglasAsignacion',
          moduleName: 'appInspec',
          files: ['inspecAsignacion']
        }
      ]
    },
    {
      name: 'administracionInspectores',
      url: '/administracion/inspectores',
      activeMenu: 'administracion',
      description: 'Administración inspectores',
      parent: 'innerLayout',
      objMXKey: 'INSPECTOR|INSPECTORES',
      views: {
        content: {
          template: '<inspec-inspectores></inspec-inspectores>'
        }
      },
      resolver: [
        {
          name: 'administracionInspectores',
          moduleName: 'appInspec',
          files: ['inspecInspectores']
        }
      ]
    },
    {
      name: 'administracionProveedores',
      url: '/administracion/proveedores',
      activeMenu: 'administracion',
      description: 'Administración Proveedores',
      parent: 'innerLayout',
      objMXKey: 'PROVEEDORES',
      views: {
        content: {
          template: '<inspec-proveedores></inspec-proveedores>'
        }
      },
      resolver: [
        {
          name: 'administracionProveedores',
          moduleName: 'appInspec',
          files: ['inspecProveedores']
        }
      ]
    },
    {
      name: 'administracionPerdidasRobosTotales',
      url: '/administracion/perdidas-robos-totales',
      activeMenu: 'administracion',
      description: 'Administración perdidas y robos totales',
      parent: 'innerLayout',
      objMXKey: 'PÉRDIDAS TOTALES',
      views: {
        content: {
          template: '<inspec-totales></inspec-totales>'
        }
      },
      resolver: [
        {
          name: 'administracionPerdidasRobosTotales',
          moduleName: 'appInspec',
          files: ['inspecTotales']
        }
      ]
    },
    {
      name: 'administracionExclusiones',
      url: '/administracion/exclusiones',
      activeMenu: 'administracion',
      description: 'Administración de Exclusiones',
      parent: 'innerLayout',
      objMXKey: 'EXCLUSIONES DE AUTOINSPECCIÓN',
      views: {
        content: {
          template: '<inspec-exclusiones></inspec-exclusiones>'
        }
      },
      resolver: [
        {
          name: 'administracionExclusiones',
          moduleName: 'appInspec',
          files: ['inspecExclusiones']
        }
      ]
    },
    {
      name: 'reportesDetalleVehiculo',
      url: '/reportes/detalle-vehiculo',
      activeMenu: 'reportes',
      description: 'Reportes detalle de vehículo',
      parent: 'innerLayout',
      objMXKey: 'DETALLE VEHICULOS',
      views: {
        content: {
          template: '<inspec-detalle-vehiculo></inspec-detalle-vehiculo>'
        }
      },
      resolver: [
        {
          name: 'reportesDetalleVehiculo',
          moduleName: 'appInspec',
          files: ['inspecDetalleVehiculo']
        }
      ]
    },
    {
      name: 'reportesDetalleAlerta',
      url: '/reportes/detalle-alerta',
      activeMenu: 'reportes',
      description: 'Reportes detalle alerta',
      parent: 'innerLayout',
      objMXKey: 'REPORTE DE ALERTAS',
      views: {
        content: {
          template: '<inspec-detalle-alerta></inspec-detalle-alerta>'
        }
      },
      resolver: [
        {
          name: 'reportesDetalleAlerta',
          moduleName: 'appInspec',
          files: ['inspecDetalleAlerta']
        }
      ]
    },
    {
      name: 'reportesGestionTiempos',
      code: '',
      url: '/reportes/gestion-tiempos',
      activeMenu: 'reportes',
      description: 'Reportes gestión de tiempos',
      objMXKey: 'GESTION DE TIEMPOS|GESTION TIEMPOS',
      parent: 'innerLayout',
      views: {
        content: {
          template: '<inspec-gestion-tiempos></inspec-gestion-tiempos>'
        }
      },
      resolver: [
        {
          name: 'reportesGestionTiempos',
          moduleName: 'appInspec',
          files: ['inspecGestionTiempos']
        }
      ]
    },
    {
      name: 'reportesSeguimiento',
      code: '',
      url: '/reportes/seguimiento',
      activeMenu: 'reportes',
      description: 'Reportes listado de solicitudes',
      objMXKey: 'SEGUIMIENTO',
      parent: 'innerLayout',
      views: {
        content: {
          template: '<inspec-seguimiento></inspec-seguimiento>'
        }
      },
      resolver: [
        {
          name: 'reportesSeguimiento',
          moduleName: 'appInspec',
          files: ['inspecSeguimiento']
        }
      ]
    },
    {
      name: 'reportesGestionDepartamento',
      url: '/reportes/gestion-departamento',
      activeMenu: 'reportes',
      description: 'Reportes gestión de departamento',
      objMXKey: 'GESTION POR DEPARTAMENTOS|GESTION X DPTOS',
      parent: 'innerLayout',
      views: {
        content: {
          template: '<inspec-gestion-departamento></inspec-gestion-departamento>'
        }
      },
      resolver: [
        {
          name: 'reportesGestionDepartamento',
          moduleName: 'appInspec',
          files: ['inspecGestionDepartamento']
        }
      ]
    },
    {
      name: 'reportesGestionInspecciones',
      code: '',
      url: '/reportes/gestion-inspecciones',
      activeMenu: 'reportes',
      description: 'Reportes gestión de inspecciones',
      objMXKey: 'GESTION DE INSPECCIONES|GESTION INSPECCIONES',
      parent: 'innerLayout',
      views: {
        content: {
          template: '<inspec-gestion-inspecciones></inspec-gestion-inspecciones>'
        }
      },
      resolver: [
        {
          name: 'reportesGestionInspecciones',
          moduleName: 'appInspec',
          files: ['inspecGestionInspecciones']
        }
      ]
    },
    {
      name: 'administracionCoordinador',
      url: '/administracion/coordinador',
      activeMenu: 'administracion',
      description: 'Administración coordinador',
      parent: 'innerLayout',
      objMXKey: 'COORDINADOR|COORDINADORES',
      views: {
        content: {
          template: '<inspec-coordinadores></inspec-coordinadores>'
        }
      },
      resolver: [
        {
          name: 'administracionCoordinador',
          moduleName: 'appInspec',
          files: ['inspecCoordinadores']
        }
      ]
    },
    {
      name: 'administracionParametro',
      url: '/administracion/parametros',
      activeMenu: 'administracion',
      description: 'Administración de parametros',
      objMXKey: 'PARAMETROS',
      parent: 'innerLayout',
      views: {
        content: {
          template: '<inspec-parametros></inspec-parametros>'
        }
      },
      resolver: [
        {
          name: 'administracionParametro',
          moduleName: 'appInspec',
          files: ['inspecParametros']
        }
      ]
    },
    {
      name: 'administracionParametroDetalle',
      url: '/administracion/parametros-detalle',
      activeMenu: 'administracion',
      description: 'Administración de parametros Detalle',
      objMXKey: 'PARAMETROS',
      parent: 'innerLayout',
      params: {parameter: null},
      views: {
        content: {
          template: '<inspec-parametros-detalle></inspec-parametros-detalle>'
        }
      },
      resolver: [
        {
          name: 'administracionParametroDetalle',
          moduleName: 'appInspec',
          files: ['inspecParametrosDetalle']
        }
      ]
    },
    {
      name: 'solicitudNuevaTrec',
      code: '',
      url: '/solicitudes/trec',
      activeMenu: 'solicitudes',
      description: 'Nueva Solicitud',
      breads: ['solicitudes'],
      params: { anchor: 'anchor-1' },
      parent: 'innerLayout',
      views: {
        content: {
          controller: 'SolicitudNuevaTrecController as $ctrl',
          templateUrl: '/inspec/app/components/solicitudes/nueva-solicitud-trec/nueva-solicitud-trec.html'
        }
      },
      resolver: [
        {
          name: 'solicitudNuevaTrec',
          moduleName: 'appInspec',
          files: ['inspecSolicitudNuevaTrec']
        }
      ]
    },
    {
      name: 'solicitudNueva',
      code: '',
      url: '/solicitudes/trec/nueva/:solicitudId',
      activeMenu: 'solicitudes',
      description: 'Solicitud nueva',
      params: { anchor: 'anchor-1', solicitudId: null, },
      parent: 'innerLayout',
      views: {
        content: {
          controller: 'SolicitudNuevaController as $ctrl',
          templateUrl: '/inspec/app/components/solicitudes/nueva-solicitud-trec/nueva-solicitud/nueva-solicitud.html'
        }
      },
      resolver: [
        {
          name: 'solicitudNueva',
          moduleName: 'appInspec',
          files: ['inspecSolicitudNueva']
        }
      ]
    }
  ];
  return data;
});
