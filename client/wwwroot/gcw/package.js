'use strict';

(function(factory) {
  define(factory);
}(function() {
  return {
    lib: {
      'gcw_routes': {
        name: 'gcw_routes',
        path: '/gcw/app/app.routes'
      },
      'appGcw': {
        name: 'appGcw',
        path: '/gcw/app/app'
      },
      'proxyGcw': {
        name: 'proxyGcw',
        path: '/gcw/app/proxy/serviceGcw'
      },
      'CommonCboService': {
        name: 'CommonCboService',
        path: '/gcw/app/common/common-cbos/common-cbos.service'
      },
      'gcwTemplate': {
        name: 'gcwTemplate',
        path: '/gcw/app/common/gcw-template/gcw-template.component'
      },
      'gcwCabecera': {
        name: 'gcwCabecera',
        path: '/gcw/app/common/cabecera/cabecera.component'
      },
      'gcwMenu': {
        name: 'gcwMenu',
        path: '/gcw/app/common/menu/menu.component'
      },
      'gcwHeader': {
        name: 'gcwHeader',
        path: '/gcw/app/common/header/header.component'
      },
      'gcwCliente': {
        name: 'gcwCliente',
        path: '/gcw/app/common/cliente/cliente.component'
      },
      'gcwAutocompleteGestor': {
        name: 'gcwAutocompleteGestor',
        path: '/gcw/app/common/autocomplete-gestor/autocomplete-gestor.component'
      },
      'gcwAutocompleteAgente': {
        name: 'gcwAutocompleteAgente',
        path: '/gcw/app/common/autocomplete-agente/autocomplete-agente.component'
      },
      'gcwCommonCbos': {
        name: 'gcwCommonCbos',
        path: '/gcw/app/common/common-cbos/common-cbos.component'
      },
      'gcwAutoliquidacion': {
        name: 'gcwAutoliquidacion',
        path: '/gcw/app/components/comisiones/autoliquidacion/autoliquidacion.component'
      },
      'gcwGanadas': {
        name: 'gcwGanadas',
        path: '/gcw/app/components/comisiones/ganadas/ganadas.component'
      },
      'gcwMovimientos': {
        name: 'gcwMovimientos',
        path: '/gcw/app/components/comisiones/movimientos/movimientos.component'
      },
      'gcwPorGanar': {
        name: 'gcwPorGanar',
        path: '/gcw/app/components/comisiones/por-ganar/por-ganar.component'
      },
      'gcwRamoCliente': {
        name: 'gcwRamoCliente',
        path: '/gcw/app/components/comisiones/ramo-cliente/ramo-cliente.component'
      },
      'gcwConstanciaDetraccion': {
        name: 'gcwConstanciaDetraccion',
        path: '/gcw/app/components/comisiones/constancia-detraccion/constancia-detraccion.component'
      },
      'gcwDashboardRedPlaza': {
        name: 'gcwDashboardRedPlaza',
        path: '/gcw/app/components/comisiones/dashboard-red-plaza/dashboard-red-plaza.component'
      },
      'gcwConsultaRedPlaza': {
        name: 'gcwConsultaRedPlaza',
        path: '/gcw/app/components/comisiones/consulta-red-plaza/consulta-red-plaza.component'
      },
      'gcwConsultaRedPlazaDetalle': {
        name: 'gcwConsultaRedPlazaDetalle',
        path: '/gcw/app/components/comisiones/consulta-red-plaza/consulta-red-plaza-detalle.component'
      },
      'gcwConsultaRedPlazaDetalleCliente': {
        name: 'gcwConsultaRedPlazaDetalleCliente',
        path: '/gcw/app/components/comisiones/consulta-red-plaza/consulta-red-plaza-detalle-cliente.component'
      },
      'gcwEstadoRecibos': {
        name: 'gcwEstadoRecibos',
        path: '/gcw/app/components/comisiones/estado-recibos/estado-recibos.component'
      },
      'gcwAnuladas': {
        name: 'gcwAnuladas',
        path: '/gcw/app/components/cobranzas/anuladas/anuladas.component'
      },
      'gcwCronogramaPagos': {
        name: 'gcwCronogramaPagos',
        path: '/gcw/app/components/cobranzas/cronograma-pagos/cronograma-pagos.component'
      },
      'gcwDocumentosPagar': {
        name: 'gcwDocumentosPagar',
        path: '/gcw/app/components/cobranzas/documentos-pagar/documentos-pagar.component'
      },
      'gcwEstadoDocumento': {
        name: 'gcwEstadoDocumento',
        path: '/gcw/app/components/cobranzas/estado-documento/estado-documento.component'
      },
      'gcwComprobanteRemitido': {
        name: 'gcwComprobanteRemitido',
        path: '/gcw/app/components/cobranzas/comprobante-remitido/comprobante-remitido.component'
      },
      'gcwLiquidacionSoat': {
        name: 'gcwLiquidacionSoat',
        path: '/gcw/app/components/cobranzas/liquidacion-soat/liquidacion-soat.component'
      },
      'gcwLiquidacionSoatHistorial': {
        name: 'gcwLiquidacionSoatHistorial',
        path:
        '/gcw/app/components/cobranzas/liquidacion-soat/liquidacion-soat-historial/liquidacion-soat-historial.component'
      },
      'gcwFacturasEmitidas': {
        name: 'gcwFacturasEmitidas',
        path: '/gcw/app/components/cobranzas/facturas-emitidas/facturas-emitidas.component'
      },
      'gcwPolizas': {
        name: 'gcwPolizas',
        path: '/gcw/app/components/cartera/polizas/polizas.component'
      },
      'gcwPolizaDetalle': {
        name: 'gcwPolizaDetalle',
        path: '/gcw/app/components/cartera/polizas/poliza-detalle/poliza-detalle.component'
      },
      'gcwAutoReemplazo': {
        name: 'gcwAutoReemplazo',
        path: '/gcw/app/components/siniestros/auto-reemplazo/auto-reemplazo.component'
      },
      'gcwAutoReemplazoProveedor': {
        name: 'gcwAutoReemplazoProveedor',
        path: '/gcw/app/components/siniestros/auto-reemplazo/auto-reemplazo-proveedor.component'
      },
      'gcwAutoReemplazoPlanilla': {
        name: 'gcwAutoReemplazoPlanilla',
        path: '/gcw/app/components/siniestros/auto-reemplazo/auto-reemplazo-planilla.component'
      },
      'gcwAutoReemplazoDetalleRequerido': {
        name: 'gcwAutoReemplazoDetalleRequerido',
        path: '/gcw/app/components/siniestros/auto-reemplazo/detalle/detalle-requerido.component'
      },
      'gcwAutoReemplazoSolicitud': {
        name: 'gcwAutoReemplazoSolicitud',
        path: '/gcw/app/components/siniestros/auto-reemplazo/detalle/solicitud.component'
      },
      'gcwSiniestrosAutos': {
        name: 'gcwSiniestrosAutos',
        path: '/gcw/app/components/siniestros/autos/siniestros-autos.component'
      },
      'gcwSiniestroAutoDetalle': {
        name: 'gcwSiniestroAutoDetalle',
        path: '/gcw/app/components/siniestros/autos/siniestro-auto-detalle/siniestro-auto-detalle.component'
      },
      'gcwRenovaciones': {
        name: 'gcwRenovaciones',
        path: '/gcw/app/components/renovaciones/renovaciones/renovaciones.component'
      },
      'gcwRenovacionDetalle': {
        name: 'gcwRenovacionDetalle',
        path: '/gcw/app/components/renovaciones/renovaciones/renovacion-detalle/renovacion-detalle.component'
      },
      'gcwBeneficios': {
        name: 'gcwBeneficios',
        path: '/gcw/app/components/beneficios/beneficios/beneficios.component'
      },
      'gcwMapfreDolar': {
        name: 'gcwMapfreDolar',
        path: '/gcw/app/components/mapfre-dolar/mapfre-dolar/mapfre-dolar.component'
      },
      'gcwEstadoMd': {
        name: 'gcwEstadoMd',
        path: '/gcw/app/components/mapfre-dolar/estado-md/estado-md.component'
      },

      'polizaServicePoliza': {
        name: 'polizaServicePoliza',
        path: '/polizas/app/proxy/servicePoliza'
      },
      'gcwServicePoliza': {
        name: 'gcwServicePoliza',
        path: '/gcw/app/factory/gcwServicePoliza'
      },
      'ErrorHandlerService' : {
        name: 'ErrorHandlerService',
        path: '/gcw/app/factory/errorHandler.service'
      },
      moment: {
        name: 'moment',
        path: '/scripts/b_components/moment/min/moment.min'
      },
      'chart': {
        name: "chart",
        path: "/scripts/b_components/chart.js/dist/Chart.bundle"
      },
      'fexConsult': {
        name: 'fexConsult',
        path: '/gcw/app/components/cobranzas/templates/fex-consult'
      },
    },
    shim: {
      'appGcw': {
        deps: [
          'angular_ui_route',
          'uIBootstrap',
          'oim_ocLazyLoad',
          'oim_layout',
          'lodash',
          'proxyLogin',
          'proxyGcw',
          'oim_security'
        ]
      },
      chart: {exports: 'chart'},
      gcwCommonCbos: {deps: ['CommonCboService']}
    },
    packages: {}
  };
}));
