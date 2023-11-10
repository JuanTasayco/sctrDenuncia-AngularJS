'use strict';

define([], function() {
  return {
    lib: {
      wp_routes: {
        name: 'wp_routes',
        path: '/webproc/app/app.routes'
      },
      proxyWp: {
        name: 'proxyWp',
        path: '/webproc/app/proxy/serviceWebproc'
      },
      wpConstant: {
        name: 'wpConstant',
        path: '/webproc/app/factory/wpConstant'
      },
      wpFactory: {
        name: 'wpFactory',
        path: '/webproc/app/factory/wpFactory'
      },
      wpFactoryHelp: {
        name: 'wpFactoryHelp',
        path: '/webproc/app/factory/wpFactoryHelp'
      },
      wpFactoryLookup: {
        name: 'wpFactoryLookup',
        path: '/webproc/app/factory/wpFactoryLookup'
      },
      wpFactoryCache: {
        name: 'wpFactoryCache',
        path: '/webproc/app/factory/wpFactoryCache'
      },
      appWp: {
        name: 'appWp',
        path: '/webproc/app/app'
      },
      ngRaven: {
        name: 'ngRaven',
        path: '/scripts/b_components/raven-js/dist/angular/raven.min'
      },
      redux: {
        name: 'redux',
        path: '/scripts/b_components/redux/index'
      },
      ngRedux: {
        name: 'ngRedux',
        path: '/scripts/b_components/ng-redux/dist/ng-redux.min'
      },
      logger: {
        name: 'logger',
        path: '/webproc/app/common/core/redux-logger'
      },
      StateConstant: {
        name: 'StateConstant',
        path: '/webproc/app/states/constants'
      },
      RootReducer: {
        name: 'RootReducer',
        path: '/webproc/app/states/reducers/index'
      },
      AsistenciaReducer: {
        name: 'AsistenciaReducer',
        path: '/webproc/app/states/reducers/asistencia.reducer'
      },
      AsistenciaActions: {
        name: 'AsistenciaActions',
        path: '/webproc/app/states/actions/asistencia.actions'
      },
      'checklist-model': {
        name: 'checklist-model',
        path: '/scripts/b_components/checklist-model/checklist-model'
      },
      wpMsgBox: {
        name: 'wpMsgBox',
        path: '/webproc/app/components/detalle-asistencia/common/msg-box/msg-box.component'
      },
      wpModalConfirm: {
        name: 'wpModalConfirm',
        path: '/webproc/app/components/detalle-asistencia/common/modal-confirm/modal-confirm.component'
      },
      wpModalMap: {
        name: 'wpModalMap',
        path: '/webproc/app/components/detalle-asistencia/common/modal-map/modal-map.component'
      },
      wpImgTabUpload: {
        name: 'wpImgTabUpload',
        path: '/webproc/app/components/detalle-asistencia/common/img-tab-upload/img-tab-upload.component'
      },
      wpModalInvestigar: {
        name: 'wpModalInvestigar',
        path:
          '/webproc/app/components/detalle-asistencia/cabecera-asistencia/modal-investigar/modal-investigar.component'
      },
      wpCabecera: {
        name: 'wpCabecera',
        path: '/webproc/app/common/cabecera/cabecera.component'
      },
      filtroAsistenciaPageController: {
        name: 'filtroAsistenciaPageController',
        path: '/webproc/app/components/filtro-asistencia/filtro-asistencia.page.controller'
      },
      wpFiltroAsistencia: {
        name: 'wpFiltroAsistencia',
        path: '/webproc/app/components/filtro-asistencia/filtro-asistencia.component'
      },
      wpListaFilter: {
        name: 'wpListaFilter',
        path: '/webproc/app/components/filtro-asistencia/lista-filter/lista-filter.component'
      },
      bandejaPageController: {
        name: 'bandejaPageController',
        path: '/webproc/app/components/bandeja/bandeja.page.controller'
      },
      wpBandeja: {
        name: 'wpBandeja',
        path: '/webproc/app/components/bandeja/bandeja.component'
      },
      wpModalReporteDiario: {
        name: 'wpModalReporteDiario',
        path: '/webproc/app/components/bandeja/modal-reporte-diario/modal-reporte-diario.component'
      },
      wpFiltro: {
        name: 'wpFiltro',
        path: '/webproc/app/components/bandeja/filtro/filtro.component'
      },
      wpAsistencia: {
        name: 'wpAsistencia',
        path: '/webproc/app/components/bandeja/asistencia/asistencia.component'
      },
      detalleAsistenciaPageController: {
        name: 'detalleAsistenciaPageController',
        path: '/webproc/app/components/detalle-asistencia/detalle-asistencia.page.controller'
      },
      consolidadoAsistenciaPageController: {
        name: 'consolidadoAsistenciaPageController',
        path: '/webproc/app/components/consolidado-asistencia/consolidado-asistencia.page.controller'
      },
      wpCabeceraAsistencia: {
        name: 'wpCabeceraAsistencia',
        path: '/webproc/app/components/detalle-asistencia/cabecera-asistencia/cabecera-asistencia.component'
      },
      wpFooterAsistencia: {
        name: 'wpFooterAsistencia',
        path: '/webproc/app/components/detalle-asistencia/footer-asistencia/footer-asistencia.component'
      },
      wpCommonCbos: {
        name: 'wpCommonCbos',
        path: '/webproc/app/components/detalle-asistencia/common/common-cbos/common-cbos.component'
      },
      wpDatosGenerales: {
        name: 'wpDatosGenerales',
        path: '/webproc/app/components/detalle-asistencia/datos-generales/datos-generales.component'
      },
      wpLugarOcurrencia: {
        name: 'wpLugarOcurrencia',
        path: '/webproc/app/components/detalle-asistencia/lugar-ocurrencia/lugar-ocurrencia.component'
      },
      wpTerceroConvenio: {
        name: 'wpTerceroConvenio',
        path: '/webproc/app/components/detalle-asistencia/tercero-convenio/tercero-convenio.component'
      },
      wpResponsabilidad: {
        name: 'wpResponsabilidad',
        path: '/webproc/app/components/detalle-asistencia/tercero-convenio/responsabilidad/responsabilidad.component'
      },
      wpAgregarAtropellado: {
        name: 'wpAgregarAtropellado',
        path: '/webproc/app/components/detalle-asistencia/common/agregar-atropellado/agregar-atropellado.component'
      },
      wpAgregarEditarAtropellado: {
        name: 'wpAgregarEditarAtropellado',
        path: '/webproc/app/components/detalle-asistencia/common/agregar-atropellado/agregar-editar-atropellado/agregar-editar-atropellado.component'
      },
      wpAtropellado: {
        name: 'wpAtropellado',
        path: '/webproc/app/components/detalle-asistencia/common/agregar-atropellado/atropellado/atropellado.component'
      },
      wpVehiculoTercero: {
        name: 'wpVehiculoTercero',
        path: '/webproc/app/components/detalle-asistencia/common/agregar-vehiculo-tercero/vehiculo-tercero/vehiculo-tercero.component'
      },
      wpAgregarVehiculoTercero: {
        name: 'wpAgregarVehiculoTercero',
        path: '/webproc/app/components/detalle-asistencia/common/agregar-vehiculo-tercero/agregar-vehiculo-tercero.component'
      },
      wpAgregarEditarVehiculoTercero:{
        name: 'wpAgregarEditarVehiculoTercero',
        path: '/webproc/app/components/detalle-asistencia/common/agregar-vehiculo-tercero/agregar-editar-vehiculo-tercero/agregar-editar-vehiculo-tercero.component'
      },
      wpAgregarBien: {
        name: 'wpAgregarBien',
        path: '/webproc/app/components/detalle-asistencia/common/agregar-bien/agregar-bien.component'
      },
      wpNivelDanho: {
        name: 'wpNivelDanho',
        path: '/webproc/app/components/detalle-asistencia/common/nivel-danho/nivel-danho.component'
      },
      wpAgregarEditarBien: {
        name: 'wpAgregarEditarBien',
        path: '/webproc/app/components/detalle-asistencia/common/agregar-bien/agregar-editar-bien/agregar-editar-bien.component'
      },
      wpBien: {
        name: 'wpBien',
        path: '/webproc/app/components/detalle-asistencia/common/agregar-bien/bien/bien.component'
      },
      wpFixedAsistencia: {
        name: 'wpFixedAsistencia',
        path: '/webproc/app/components/detalle-asistencia/fixed-asistencia/fixed-asistencia.component'
      },
      wpPersonComponent: {
        name: 'wpPersonComponent',
        path: '/webproc/app/components/detalle-asistencia/person-component/person-component.component'
      },
      wpVehiculoSoat:{
        name: 'wpVehiculoSoat',
        path: '/webproc/app/components/detalle-asistencia/vehiculo-soat/vehiculo-soat.component'
      },
      mpfTimepicker: {
        name: 'mpfTimepicker',
        path: '/scripts/mpf-main-controls/components/mpf-timepicker/mpf-timepicker.component'
      },
      wpConductorOcupante: {
        name: 'wpConductorOcupante',
        path: '/webproc/app/components/detalle-asistencia/conductor-ocupante/conductor-ocupante.component'
      },
      wpAgregarOcupante: {
        name: 'wpAgregarOcupante',
        path: '/webproc/app/components/detalle-asistencia/common/agregar-ocupante/agregar-ocupante.component'
      },
      wpAgregarEditarOcupante: {
        name: 'wpAgregarEditarOcupante',
        path:
          '/webproc/app/components/detalle-asistencia/common/agregar-ocupante/agregar-editar-ocupante/agregar-editar-ocupante.component'
      },
      wpOcupante: {
        name: 'wpOcupante',
        path: '/webproc/app/components/detalle-asistencia/common/agregar-ocupante/ocupante/ocupante.component'
      },
      wpVehiculo: {
        name: 'wpVehiculo',
        path: '/webproc/app/components/detalle-asistencia/vehiculo/vehiculo.component'
      },
      wpAutoAcor: {
        name: 'wpAutoAcor',
        path: '/webproc/app/components/detalle-asistencia/vehiculo/auto-acor/auto-acor.component'
      },
      wpAgregarDanho: {
        name: 'wpAgregarDanho',
        path: '/webproc/app/components/detalle-asistencia/common/agregar-danho/agregar-danho.component'
      },
      wpAgregarEditarDanho: {
        name: 'wpAgregarEditarDanho',
        path:
          '/webproc/app/components/detalle-asistencia/common/agregar-danho/agregar-editar-danho/agregar-editar-danho.component'
      },
      wpDanho: {
        name: 'wpDanho',
        path: '/webproc/app/components/detalle-asistencia/common/agregar-danho/danho/danho.component'
      },
      wpTerceros: {
        name: 'wpTerceros',
        path: '/webproc/app/components/detalle-asistencia/terceros/terceros.component'
      },
      wpAgregarBienOld: {
        name: 'wpAgregarBienOld',
        path: '/webproc/app/components/detalle-asistencia/terceros/agregar-bien/agregar-bien.component'
      },
      wpAgregarEditarBienOld: {
        name: 'wpAgregarEditarBienOld',
        path:
          '/webproc/app/components/detalle-asistencia/terceros/agregar-bien/agregar-editar-bien/agregar-editar-bien.component'
      },
      wpBienOld: {
        name: 'wpBienOld',
        path: '/webproc/app/components/detalle-asistencia/terceros/agregar-bien/bien/bien.component'
      },
      wpAgregarPeaton: {
        name: 'wpAgregarPeaton',
        path: '/webproc/app/components/detalle-asistencia/terceros/agregar-peaton/agregar-peaton.component'
      },
      wpAgregarEditarPeaton: {
        name: 'wpAgregarEditarPeaton',
        path:
          '/webproc/app/components/detalle-asistencia/terceros/agregar-peaton/agregar-editar-peaton/agregar-editar-peaton.component'
      },
      wpPeaton: {
        name: 'wpPeaton',
        path: '/webproc/app/components/detalle-asistencia/terceros/agregar-peaton/peaton/peaton.component'
      },
      wpAgregarVehiculo: {
        name: 'wpAgregarVehiculo',
        path: '/webproc/app/components/detalle-asistencia/terceros/agregar-vehiculo/agregar-vehiculo.component'
      },
      wpAgregarEditarVehiculo: {
        name: 'wpAgregarEditarVehiculo',
        path:
          '/webproc/app/components/detalle-asistencia/terceros/agregar-vehiculo/agregar-editar-vehiculo/agregar-editar-vehiculo.component'
      },
      wpDetalleSiniestro: {
        name: 'wpDetalleSiniestro',
        path: '/webproc/app/components/detalle-asistencia/detalle-siniestro/detalle-siniestro.component'
      },
      wpConsolidado: {
        name: 'wpConsolidado',
        path: '/webproc/app/components/detalle-asistencia/consolidado/consolidado.component'
      },
      wpInfoSiniestro: {
        name: 'wpInfoSiniestro',
        path: '/webproc/app/components/detalle-asistencia/consolidado/info-siniestro/info-siniestro.component'
      },
      wpTalleres: {
        name: 'wpTalleres',
        path: '/webproc/app/components/detalle-asistencia/talleres/talleres.component'
      },
      wpFiltroTaller: {
        name: 'wpFiltroTaller',
        path: '/webproc/app/components/detalle-asistencia/talleres/filtro-taller/filtro-taller.component'
      },
      wpTaller: {
        name: 'wpTaller',
        path: '/webproc/app/components/detalle-asistencia/talleres/taller/taller.component'
      },
      wpModalDireccion: {
        name: 'wpModalDireccion',
        path: '/webproc/app/components/detalle-asistencia/talleres/modal-direccion/modal-direccion.component'
      },
      wpModalManual: {
        name: 'wpModalManual',
        path: '/webproc/app/components/detalle-asistencia/talleres/modal-manual/modal-manual.component'
      }
    },
    shim: {
      appWp: {
        deps: [
          'angular_ui_route',
          'uIBootstrap',
          'oim_ocLazyLoad',
          'oim_layout',
          'lodash',
          'proxyLogin',
          'oim_security',
          'proxyWp',
          'wpFactory',
          'wpConstant',
          'ngRedux'
        ]
      },
      ngRedux: {
        deps: ['angular']
      },
      filtroAsistenciaPageController: {
        deps: ['wpFiltroAsistencia', 'wpCabecera', 'wpListaFilter']
      },
      bandejaPageController: {
        deps: ['wpBandeja', 'wpCabecera', 'wpFiltro', 'wpAsistencia', 'wpModalReporteDiario']
      },
      wpTalleres: {
        deps: ['wpFiltroTaller', 'wpTaller', 'wpModalDireccion', 'wpModalManual']
      },
      detalleAsistenciaPageController: {
        deps: ['wpCabeceraAsistencia', 'wpConstant', 'mpfTimepicker', 'wpCommonCbos', 'wpLugarOcurrencia','wpTerceroConvenio','wpFixedAsistencia','wpPersonComponent','wpVehiculoSoat','wpFooterAsistencia']
      },
      wpTerceroConvenio: {
        deps: ['wpAgregarAtropellado','wpAgregarBien','wpNivelDanho','wpResponsabilidad','wpAgregarVehiculoTercero','mxImageUploader']
      },
      wpAgregarAtropellado: {
        deps: ['wpAgregarEditarAtropellado','wpAtropellado','mxImageUploader']
      },
      wpAgregarEditarVehiculoTercero:{
        deps: ['mxImageUploader','wpModalMap']
      },
      wpAgregarVehiculoTercero: {
        deps: ['wpAgregarEditarVehiculoTercero','wpVehiculoTercero','mxImageUploader']
      },
      wpAgregarBien: {
        deps: ['wpAgregarEditarBien','wpBien']
      },
      wpConductorOcupante: {
        deps: ['wpAgregarOcupante']
      },
      wpLugarOcurrencia: {
        deps: ['wpImgTabUpload','wpModalMap','wpNivelDanho']
      },
      wpImgTabUpload: {
        deps: ['mxImageUploader']
      },
      wpVehiculo: {
        deps: ['wpAgregarDanho', 'wpAutoAcor', 'wpImgTabUpload']
      },
      wpTerceros: {
        deps: ['wpAgregarBienOld', 'wpAgregarPeaton', 'wpAgregarVehiculo', 'wpImgTabUpload']
      },
      wpDetalleSiniestro: {
        deps: ['mxImageUploader']
      },
      wpCabeceraAsistencia: {
        deps: ['wpModalConfirm', 'wpModalInvestigar']
      },
      wpAgregarDanho: {
        deps: ['wpAgregarEditarDanho', 'wpDanho']
      },
      wpAgregarOcupante: {
        deps: ['wpAgregarEditarOcupante', 'wpOcupante']
      },
      wpAgregarBienOld: {
        deps: ['wpAgregarEditarBien', 'wpBienOld']
      },
      wpAgregarPeaton: {
        deps: ['wpAgregarEditarPeaton', 'wpPeaton']
      },
      wpConsolidado: {
        deps: ['wpInfoSiniestro','wpConstant']
      }
    },
    packages: {}
  };
});
