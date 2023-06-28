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
        authorizedResource: ['accessSupplier', function(accessSupplier) {
          return accessSupplier.getAllObject();
        }]
      },
      resolver: [
        {
          name: 'layout',
          moduleName: 'appGcw',
          files: [
            'topController',
            'headerController',
            'leftBarController',
            'bodyMiddelController',
            'bodyLeftController',
            'rightBarController',
            'footerController',
            'bottomController',
            'gcwTemplate',
            'gcwCabecera',
            'gcwMenu',
            'gcwHeader',
            'gcwAutocompleteGestor',
            'gcwAutocompleteAgente',
            'gcwCommonCbos',
            'ErrorHandlerService'
          ]
        }
      ]
    },
    {
      name: 'homeGcw',
      code: '',
      url: '/',
      description: 'Consultas de gestión',
      parent: 'root',
      views: {
        content: {
          controller: 'GcwHomeController',
          templateUrl: '/gcw/app/home/controller/gcw-home.html'
        }
      },
      resolver: [
        {
          name: 'homeGcw',
          moduleName: 'appGcw',
          files: [
            '/gcw/app/home/controller/gcw-home.controller.js'
          ]
        }
      ]
    },
    {
      name: 'consulta',
      abstract: true,
      code: '',
      url: '',
      description: 'Consulta de Gestión',
      parent: 'root',
      views: {
        content: {
          template: '<gcw-template></gcw-template>'
        }
      }
    },
    {
      name: 'consulta.3741',
      code: '',
      description: 'Comisiones - Autoliquidacion',
      url: '/comisiones/autoliquidacion',
      views: {
        'contenido': {
          template: '<gcw-autoliquidacion></gcw-autoliquidacion>'
        }
      },
      resolver: [
        {
          name: 'consulta.3741',
          moduleName: 'appGcw',
          files: [
            'gcwAutoliquidacion'
          ]
        }
      ]
    },
    {
      name: 'consulta.3',
      code: '',
      description: 'Comisiones - Ganadas',
      url: '/comisiones/ganadas',
      views: {
        'contenido': {
          template: '<gcw-ganadas></gcw-ganadas>'
        }
      },
      resolver: [
        {
          name: 'consulta.3',
          moduleName: 'appGcw',
          files: [
            'gcwGanadas'
          ]
        }
      ]
    },
    {
      name: 'consulta.23',
      code: '',
      description: 'Comisiones - Movimientos',
      url: '/comisiones/movimientos',
      views: {
        'contenido': {
          template: '<gcw-movimientos></gcw-movimientos>'
        }
      },
      resolver: [
        {
          name: 'consulta.23',
          moduleName: 'appGcw',
          files: [
            'gcwMovimientos'
          ]
        }
      ]
    },
    {
      name: 'consulta.4',
      code: '',
      description: 'Comisiones - Por ganar',
      url: '/comisiones/ganar',
      views: {
        'contenido': {
          template: '<gcw-por-ganar></gcw-por-ganar>'
        }
      },
      resolver: [
        {
          name: 'consulta.4',
          moduleName: 'appGcw',
          files: [
            'gcwPorGanar'
          ]
        }
      ]
    },
    {
      name: 'consulta.5',
      code: '',
      description: 'Comisiones - Por Ramo y/o Cliente',
      url: '/comisiones/ramo-cliente',
      views: {
        'contenido': {
          template: '<gcw-ramo-cliente></gcw-ramo-cliente>'
        }
      },
      resolver: [
        {
          name: 'consulta.5',
          moduleName: 'appGcw',
          files: [
            'gcwRamoCliente',
            'gcwCliente'
          ]
        }
      ]
    },
    {
      name: 'consulta.18',
      code: '',
      description: 'Comisiones - Constancia de Detracción',
      url: '/comisiones/constancia-detraccion',
      views: {
        'contenido': {
          template: '<gcw-constancia-detraccion></gcw-constancia-detraccion>'
        }
      },
      resolver: [
        {
          name: 'consulta.18',
          moduleName: 'appGcw',
          files: [
            'gcwConstanciaDetraccion'
          ]
        }
      ]
    },
    {
      name: 'consulta.1481',
      code: '',
      description: 'Comisiones - Consultas de Red Plaza',
      url: '/comisiones/consulta-red-plaza',
      views: {
        'contenido': {
          template: '<gcw-consulta-red-plaza></gcw-consulta-red-plaza>'
        }
      },
      resolver: [
        {
          name: 'consulta.1481',
          moduleName: 'appGcw',
          files: [
            'gcwConsultaRedPlaza'
          ]
        }
      ]
    },
    {
      name: 'consulta.1807',
      code: '',
      url: '/comisiones/consulta-red-plaza',
      views: {
        'contenido': {
          template: '<gcw-consulta-red-plaza></gcw-consulta-red-plaza>'
        }
      },
      resolver: [
        {
          name: 'consulta.1807',
          moduleName: 'appGcw',
          files: [
            'gcwConsultaRedPlaza'
          ]
        }
      ]
    },
    {
      name: 'consulta.consultaRedplazaDetalle',
      code: '',
      url: '/comisiones/consulta-red-plaza/detalle/:month/:year/:id',
      views: {
        'contenido': {
          template: '<gcw-consulta-red-plaza-detalle></gcw-consulta-red-plaza-detalle>'
        }
      },
      resolver: [
        {
          name: 'consulta.consultaRedplazaDetalle',
          moduleName: 'appGcw',
          files: [
            'gcwConsultaRedPlazaDetalle'
          ]
        }
      ]
    },
    {
      name: 'consulta.consultaRedplazaDetalleCliente',
      code: '',
      url: '/comisiones/consulta-red-plaza/detalle/detalle-cliente/:month/:year/:typeDoc/:numDoc/:id',
      views: {
        'contenido': {
          template: '<gcw-consulta-red-plaza-detalle-cliente></gcw-consulta-red-plaza-detalle-cliente>'
        }
      },
      resolver: [
        {
          name: 'consulta.consultaRedplazaDetalleCliente',
          moduleName: 'appGcw',
          files: [
            'gcwConsultaRedPlazaDetalleCliente'
          ]
        }
      ]
    },
    {
      name: 'consulta.1501',
      code: '',
      description: 'Comisiones - Dashboard Red Plaza',
      url: '/comisiones/dashboard-red-plaza',
      views: {
        'contenido': {
          template: '<gcw-dashboard-red-plaza></gcw-dashboard-red-plaza>'
        }
      },
      resolver: [
        {
          name: 'consulta.1501',
          moduleName: 'appGcw',
          files: [
            'gcwDashboardRedPlaza'
          ]
        }
      ]
    },
    {
      name: 'consulta.1808',
      code: '',
      url: '/comisiones/dashboard-red-plaza',
      views: {
        'contenido': {
          template: '<gcw-dashboard-red-plaza></gcw-dashboard-red-plaza>'
        }
      },
      resolver: [
        {
          name: 'consulta.1808',
          moduleName: 'appGcw',
          files: [
            'gcwDashboardRedPlaza'
          ]
        }
      ]
    },
    {
      name: 'consulta.24',
      code: '',
      description: 'Comisiones - Estado de Recibos',
      url: '/comisiones/estado-recibos',
      views: {
        'contenido': {
          template: '<gcw-estado-recibos></gcw-estado-recibos>'
        }
      },
      resolver: [
        {
          name: 'consulta.24',
          moduleName: 'appGcw',
          files: [
            'gcwEstadoRecibos'
          ]
        }
      ]
    },
    {
      name: 'consulta.6',
      code: '',
      description: 'Cobranzas - Anuladas por deuda',
      url: '/cobranzas/anuladas',
      views: {
        'contenido': {
          template: '<gcw-anuladas></gcw-anuladas>'
        }
      },
      resolver: [
        {
          name: 'consulta.6',
          moduleName: 'appGcw',
          files: [
            'gcwAnuladas',
            'gcwCliente'
          ]
        }
      ]
    },
    {
      name: 'consulta.15',
      code: '',
      description: 'Cobranzas - Cronograma de Pagos',
      url: '/cobranzas/cronograma-pagos',
      views: {
        'contenido': {
          template: '<gcw-cronograma-pagos></gcw-cronograma-pagos>'
        }
      },
      resolver: [
        {
          name: 'consulta.15',
          moduleName: 'appGcw',
          files: [
            'gcwCronogramaPagos',
            'gcwCliente'
          ]
        }
      ]
    },
    {
      name: 'consulta.14',
      code: '',
      description: 'Cobranzas - Documentos por Pagar',
      url: '/cobranzas/documentos-pagar',
      views: {
        'contenido': {
          template: '<gcw-documentos-pagar></gcw-documentos-pagar>'
        }
      },
      resolver: [
        {
          name: 'consulta.14',
          moduleName: 'appGcw',
          files: [
            'gcwDocumentosPagar',
            'gcwCliente'
          ]
        }
      ]
    },
    {
      name: 'consulta.16',
      code: '',
      description: 'Cobranzas - Estado de Documento',
      url: '/cobranzas/estado-documento',
      views: {
        'contenido': {
          template: '<gcw-estado-documento></gcw-estado-documento>'
        }
      },
      resolver: [
        {
          name: 'consulta.16',
          moduleName: 'appGcw',
          files: [
            'gcwEstadoDocumento'
          ]
        }
      ]
    },
    {
      name: 'consulta.40',
      code: '',
      description: 'Cobranzas - Comprobante Remitido',
      url: '/cobranzas/comprobante-remitido',
      views: {
        'contenido': {
          template: '<gcw-comprobante-remitido></gcw-comprobante-remitido>'
        }
      },
      resolver: [
        {
          name: 'consulta.40',
          moduleName: 'appGcw',
          files: [
            'gcwComprobanteRemitido'
          ]
        }
      ]
    },
    {
      name: 'consulta.26',
      code: '',
      description: 'Cobranzas - Liquidación SOAT',
      url: '/cobranzas/liquidacion-soat',
      views: {
        'contenido': {
          template: '<gcw-liquidacion-soat></gcw-liquidacion-soat>'
        }
      },
      resolver: [
        {
          name: 'consulta.26',
          moduleName: 'appGcw',
          files: [
            'gcwLiquidacionSoat'
          ]
        }
      ]
    },
    {
      name: 'consulta.liquidacionSoatHistorial',
      code: '',
      url: '/cobranzas/liquidacion-soat-historial',
      views: {
        'contenido': {
          template: '<gcw-liquidacion-soat-historial></gcw-liquidacion-soat-historial>'
        }
      },
      resolver: [
        {
          name: 'consulta.liquidacionSoatHistorial',
          moduleName: 'appGcw',
          files: [
            'gcwLiquidacionSoatHistorial'
          ]
        }
      ]
    },
    {
      name: 'consulta.1321',
      code: '',
      description: 'Cobranzas - Facturas Emitidas',
      url: '/cobranzas/facturas-emitidas',
      views: {
        'contenido': {
          template: '<gcw-facturas-emitidas></gcw-facturas-emitidas>'
        }
      },
      resolver: [
        {
          name: 'consulta.facturasEmitidas',
          moduleName: 'appGcw',
          files: [
            'gcwFacturasEmitidas',
            'gcwCliente'
          ]
        }
      ]
    },
    {
      name: 'consulta.11',
      code: '',
      description: 'Cartera - Polizas',
      url: '/polizas',
      views: {
        'contenido': {
          template: '<gcw-polizas></gcw-polizas>'
        }
      },
      resolver: [
        {
          name: 'consulta.11',
          moduleName: 'appGcw',
          files: [
            'gcwPolizas',
            'gcwCliente'
          ]
        }
      ]
    },
    {
      name: 'consulta.polizaDetalle',
      code: '',
      url: '/polizas/poliza-detalle/:id',
      views: {
        'contenido': {
          template: '<gcw-poliza-detalle></gcw-poliza-detalle>'
        }
      },
      resolver: [
        {
          name: 'consulta.polizaDetalle',
          moduleName: 'appGcw',
          files: [
            'gcwPolizaDetalle'
          ]
        }
      ]
    },
    {
      name: 'consulta.33',
      code: '',
      url: '/siniestros/auto-reemplazo',
      views: {
        'contenido': {
          template: '<gcw-auto-reemplazo></gcw-auto-reemplazo>'
        }
      },
      resolver: [
        {
          name: 'consulta.33',
          moduleName: 'appGcw',
          files: [
            'gcwAutoReemplazo'
          ]
        }
      ]
    },
    {
      name: 'consulta.autoReemplazoProveedor',
      code: '',
      url: '/siniestros/auto-reemplazo/proveedor',
      views: {
        'contenido': {
          template: '<gcw-auto-reemplazo-proveedor></gcw-auto-reemplazo-proveedor>'
        }
      },
      resolver: [
        {
          name: 'autoReemplazoProveedor',
          moduleName: 'appGcw',
          files: [
            'gcwAutoReemplazoProveedor'
          ]
        }
      ]
    },
    {
      name: 'consulta.autoReemplazoPlanilla',
      code: '',
      url: '/siniestros/auto-reemplazo/planilla',
      views: {
        'contenido': {
          template: '<gcw-auto-reemplazo-planilla></gcw-auto-reemplazo-planilla>'
        }
      },
      resolver: [
        {
          name: 'autoReemplazoPlanilla',
          moduleName: 'appGcw',
          files: [
            'gcwAutoReemplazoPlanilla'
          ]
        }
      ]
    },
    {
      name: 'consulta.autoReemplazoDetalleRequerido',
      code: '',
      params: { detail: null},
      url: '/siniestros/auto-reemplazo/detalle',
      views: {
        'contenido': {
          template: '<gcw-auto-reemplazo-detalle-requerido></gcw-auto-reemplazo-detalle-requerido>'
        }
      },
      resolver: [
        {
          name: 'autoReemplazoDetalleRequerido',
          moduleName: 'appGcw',
          files: [
            'gcwAutoReemplazoDetalleRequerido'
          ]
        }
      ]
    },
    {
      name: 'consulta.autoReemplazoSolicitud',
      code: '',
      url: '/siniestros/auto-reemplazo/solicitud',
      views: {
        'contenido': {
          template: '<gcw-auto-reemplazo-solicitud></gcw-auto-reemplazo-solicitud>'
        }
      },
      resolver: [
        {
          name: 'autoReemplazoSolicitud',
          moduleName: 'appGcw',
          files: [
            'gcwAutoReemplazoSolicitud'
          ]
        }
      ]
    },
    {
      name: 'consulta.7',
      code: '',
      url: '/siniestros/siniestros-autos',
      views: {
        'contenido': {
          template: '<gcw-siniestros-autos></gcw-siniestros-autos>'
        }
      },
      resolver: [
        {
          name: 'consulta.7',
          moduleName: 'appGcw',
          files: [
            'gcwSiniestrosAutos'
          ]
        }
      ]
    },
    {
      name: 'consulta.siniestroAutoDetalle',
      code: '',
      url: '/siniestros/siniestro-auto-detalle/:id',
      views: {
        'contenido': {
          template: '<gcw-siniestro-auto-detalle></gcw-siniestro-auto-detalle>'
        }
      },
      resolver: [
        {
          name: 'consulta.siniestroAutoDetalle',
          moduleName: 'appGcw',
          files: [
            'gcwSiniestroAutoDetalle'
          ]
        }
      ]
    },
    {
      name: 'consulta.17',
      code: '',
      description: 'Renovaciones',
      url: '/renovaciones',
      views: {
        'contenido': {
          template: '<gcw-renovaciones></gcw-renovaciones>'
        }
      },
      resolver: [
        {
          name: 'consulta.17',
          moduleName: 'appGcw',
          files: [
            'gcwRenovaciones',
            'gcwCliente'
          ]
        }
      ]
    },
    {
      name: 'consulta.renovacionDetalle',
      code: '',
      url: '/renovaciones/renovacion-detalle/:id',
      views: {
        'contenido': {
          template: '<gcw-renovacion-detalle></gcw-renovacion-detalle>'
        }
      },
      resolver: [
        {
          name: 'consulta.renovacionDetalle',
          moduleName: 'appGcw',
          files: [
            'gcwRenovacionDetalle'
          ]
        }
      ]
    },
    {
      name: 'consulta.29',
      code: '',
      description: 'Beneficios - Listado Beneficios',
      url: '/renovaciones/beneficios',
      views: {
        'contenido': {
          template: '<gcw-beneficios></gcw-beneficios>'
        }
      },
      resolver: [
        {
          name: 'consulta.29',
          moduleName: 'appGcw',
          files: [
            'gcwBeneficios'
          ]
        }
      ]
    },
    {
      name: 'consulta.mapfreDolar',
      code: '',
      description: 'Mapfre Dolar',
      url: '/mapfre-dolar/mapfre-dolar',
      views: {
        'contenido': {
          template: '<gcw-mapfre-dolar></gcw-mapfre-dolar>'
        }
      },
      resolver: [
        {
          name: 'consulta.mapfreDolar',
          moduleName: 'appGcw',
          files: [
            'gcwMapfreDolar'
          ]
        }
      ]
    },
    {
      name: 'consulta.28',
      code: '',
      url: '/mapfre-dolar/estado-md',
      views: {
        'contenido': {
          template: '<gcw-estado-md></gcw-estado-md>'
        }
      },
      resolver: [
        {
          name: 'consulta.28',
          moduleName: 'appGcw',
          files: [
            'gcwEstadoMd'
          ]
        }
      ]
    },
    {
      name: 'consulta.20',
      code: '',
      url: '/mapfre-dolar/mapfre-dolar',
      views: {
        'contenido': {
          template: '<gcw-mapfre-dolar></gcw-mapfre-dolar>'
        }
      },
      resolver: [
        {
          name: 'consulta.20',
          moduleName: 'appGcw',
          files: [
            'gcwMapfreDolar'
          ]
        }
      ]
    }
  ];

  return data;
});
