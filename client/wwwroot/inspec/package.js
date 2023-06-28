'use strict';

(function (factory) {
  define(factory);
})(function () {
  return {
    lib: {
      inspec_routes: {
        name: 'inspec_routes',
        path: '/inspec/app/app.routes'
      },
      proxyInspec: {
        name: 'proxyInspec',
        path: '/inspec/app/proxy/serviceInspec'
      },
      inspecConstant: {
        name: 'inspecConstant',
        path: '/inspec/app/factory/inspecConstant'
      },
      inspecFactory: {
        name: 'inspecFactory',
        path: '/inspec/app/factory/inspecFactory'
      },
      inspecFactoryHelper: {
        name: 'inspecFactoryHelper',
        path: '/inspec/app/factory/inspecFactoryHelper'
      },
      appInspec: {
        name: 'appInspec',
        path: '/inspec/app/app'
      },
      inspecMenu: {
        name: 'inspecMenu',
        path: '/inspec/app/common/menu/menu.component'
      },
      titleSection: {
        name: 'titleSection',
        path: '/inspec/app/common/title/title.component'
      },
      solicitudesController: {
        name: 'solicitudesController',
        path: '/inspec/app/solicitudes/controller/solicitudesController'
      },
      mpfTimepicker: {
        name: 'mpfTimepicker',
        path: '/scripts/mpf-main-controls/components/mpf-timepicker/mpf-timepicker.component'
      },
      mpfActionButton: {
        name: 'mpfActionButton',
        path: '/inspec/app/components/mpf-action-button'
      },
      mpfSearchFilter: {
        name: 'mpfSearchFilter',
        path: '/inspec/app/components/mpf-search-filter'
      },
      servicePoliza: {
        name: 'servicePoliza',
        path: '/polizas/app/proxy/servicePoliza'
      },
      UserService: {
        name: 'UserService',
        path: '/inspec/app/services/user.service'
      },
      ErrorHandlerService: {
        name: 'ErrorHandlerService',
        path: '/inspec/app/services/errorHandler.service'
      },
      FileReaderService: {
        name: 'FileReaderService',
        path: '/inspec/app/services/fileReader.service'
      },
      ActionsHandlerService: {
        name: 'ActionsHandlerService',
        path: '/inspec/app/services/actionsHandler.service'
      },
      moment: {
        name: 'moment',
        path: '/scripts/b_components/moment/min/moment.min'
      },
      fullcalendar: {
        name: 'fullcalendar',
        path: '/scripts/b_components/fullcalendar/dist/fullcalendar.min'
      },
      fullcalendarLanguage: {
        name: 'fullcalendarLanguage',
        path: '/scripts/b_components/fullcalendar/dist/locale/es'
      },
      inspecAlerts: {
        name: 'inspecAlerts',
        path: '/inspec/app/common/alerts/alerts.component'
      },
      inspecImagePreview: {
        name: 'inspecImagePreview',
        path: '/inspec/app/_app/common/image-preview/image-preview.component'
      },
      inspecImagePreviewMultiple: {
        name: 'inspecImagePreviewMultiple',
        path: '/inspec/app/_app/common/image-preview-multiple/image-preview-multiple.component'
      },
      inspecModalReplicate: {
        name: 'inspecModalReplicate',
        path: '/inspec/app/_app/common/modals/modal-replicate.component'
      },
      inspecActionButton: {
        name: 'inspecActionButton',
        path: '/inspec/app/common/action-button/action-button.component'
      },
      inspecAccessories: {
        name: 'inspecAccessories',
        path: '/inspec/app/common/accessories/accessories.component'
      },
      inspecOrderBy: {
        name: 'inspecOrderBy',
        path: '/inspec/app/common/order-by/order-by.component'
      },
      inspecVehicleData: {
        name: 'inspecVehicleData',
        path: '/inspec/app/common/vehicle-data/vehicle-data.component'
      },
      inspecEmptyData: {
        name: 'inspecEmptyData',
        path: '/inspec/app/_app/common/empty-data/empty-data.component'
      },
      inspecRequestLabel: {
        name: 'inspecRequestLabel',
        path: '/inspec/app/common/request-label/request-label.component'
      },
      inspecCalendar: {
        name: 'inspecCalendar',
        path: '/inspec/app/_app/common/calendar/calendar.component'
      },
      inspecPreviewInspection: {
        name: 'inspecPreviewInspection',
        path: '/inspec/app/_app/common/preview-inspection/preview-inspection.controller'
      },
      inspecSchedule: {
        name: 'inspecSchedule',
        path: '/inspec/app/_app/common/schedule/schedule.component'
      },
      inspecUbigeo: {
        name: 'inspecUbigeo',
        path: '/inspec/app/_app/common/ubigeo/ubigeo.component'
      },
      inspecGroupPolize: {
        name: 'inspecGroupPolize',
        path: '/inspec/app/_app/common/group-polize/group-polize.component'
      },
      inspecApplicant: {
        name: 'inspecApplicant',
        path: '/inspec/app/common/applicant/applicant.component'
      },
      inspecContractor: {
        name: 'inspecContractor',
        path: '/inspec/app/common/contractor/contractor.component'
      },
      inspecPremium: {
        name: 'inspecPremium',
        path: '/inspec/app/common/premium/premium.component'
      },
      inspecCotizaciones: {
        name: 'inspecCotizaciones',
        path: '/inspec/app/components/cotizaciones/cotizaciones/cotizaciones.component'
      },
      inspecProgramaciones: {
        name: 'inspecProgramaciones',
        path: '/inspec/app/components/programaciones/programaciones/programaciones.component'
      },
      inspecAgenda: {
        name: 'inspecAgenda',
        path: '/inspec/app/components/agenda/agenda/agenda.component'
      },
      inspecCotizacionesDetalle: {
        name: 'inspecCotizacionesDetalle',
        path: '/inspec/app/components/cotizaciones/cotizaciones/cotizacion-detalle/cotizacion-detalle.component'
      },
      inspecSolicitudes: {
        name: 'inspecSolicitudes',
        path: '/inspec/app/components/solicitudes/solicitudes.component'
      },
      inspecSolicitudDetalle: {
        name: 'inspecSolicitudDetalle',
        path: '/inspec/app/components/solicitudes/solicitud-detalle/solicitud-detalle.component'
      },
      inspecSolicitudNuevaIndividual: {
        name: 'inspecSolicitudNuevaIndividual',
        path: '/inspec/app/components/solicitudes/nueva-solicitud-individual/nueva-solicitud-individual.component'
      },
      inspecSolicitudNuevaFlota: {
        name: 'inspecSolicitudNuevaFlota',
        path: '/inspec/app/components/solicitudes/nueva-solicitud-flota/nueva-solicitud-flota.component'
      },
      inspecSolicitudNuevaEspecial: {
        name: 'inspecSolicitudNuevaEspecial',
        path: '/inspec/app/components/solicitudes/nueva-solicitud-especial/nueva-solicitud-especial.component'
      },
      inspecSolicitudNuevaSinCotizacionRegular: {
        name: 'inspecSolicitudNuevaSinCotizacionRegular',
        path: '/inspec/app/components/solicitudes/nueva-solicitud-sin-cotizacion/nueva-regular/nueva-regular.component'
      },
      inspecSolicitudNuevaSinCotizacionReinspeccion: {
        name: 'inspecSolicitudNuevaSinCotizacionReinspeccion',
        path: '/inspec/app/components/solicitudes/nueva-solicitud-sin-cotizacion/nueva-reinspeccion/nueva-reinspeccion.component'
      },
      inspecRegistroInspeccion: {
        name: 'inspecRegistroInspeccion',
        path: '/inspec/app/components/inspecciones/registro-inspeccion/registro-inspeccion.component'
      },
      inspecNuevaInspeccion: {
        name: 'inspecNuevaInspeccion',
        path: '/inspec/app/components/inspecciones/nueva-inspeccion/nueva-inspeccion.component'
      },
      inspecNuevaInspeccionSinCotizacion: {
        name: 'inspecNuevaInspeccionSinCotizacion',
        path: '/inspec/app/components/inspecciones/nueva-inspeccion-sin-cotizacion/nueva-inspeccion-sin-cotizacion.component'
      },
      inspecTerminada: {
        name: 'inspecTerminada',
        path: '/inspec/app/components/inspecciones/inspeccion-terminada/inspeccion-terminada.component'
      },
      inspecProveedores: {
        name: 'inspecProveedores',
        path: '/inspec/app/components/administracion/proveedores/proveedores.component'
      },
      inspecAsignacion: {
        name: 'inspecAsignacion',
        path: '/inspec/app/components/administracion/asignacion/asignacion.component'
      },
      inspecCoordinadores: {
        name: 'inspecCoordinadores',
        path: '/inspec/app/components/administracion/coordinadores/coordinadores.component'
      },
      inspecInspectores: {
        name: 'inspecInspectores',
        path: '/inspec/app/components/administracion/inspectores/inspectores.component'
      },
      inspecParametros: {
        name: 'inspecParametros',
        path: '/inspec/app/components/administracion/parametros/parametros.component'
      },
      inspecParametrosDetalle: {
        name: 'inspecParametrosDetalle',
        path: '/inspec/app/components/administracion/parametros/parametros-detalle/parametros-detalle.component'
      },
      inspecGestionTiempos: {
        name: 'inspecGestionTiempos',
        path: '/inspec/app/components/reportes/gestion-tiempos/gestion-tiempos.component'
      },
      inspecDetalleVehiculo: {
        name: 'inspecDetalleVehiculo',
        path: '/inspec/app/components/reportes/detalle-vehiculo/detalle-vehiculo.component'
      },
      inspecSeguimiento: {
        name: 'inspecSeguimiento',
        path: '/inspec/app/components/reportes/seguimiento/seguimiento.component'
      },
      inspecDetalleAlerta: {
        name: 'inspecDetalleAlerta',
        path: '/inspec/app/components/reportes/detalle-alerta/detalle-alerta.component'
      },
      inspecGestionDepartamento: {
        name: 'inspecGestionDepartamento',
        path: '/inspec/app/components/reportes/gestion-departamento/gestion-departamento.component'
      },
      inspecReportResults: {
        name: 'inspecReportResults',
        path: '/inspec/app/common/report-results/report-results.component'
      },
      inspecGestionInspecciones: {
        name: 'inspecGestionInspecciones',
        path: '/inspec/app/components/reportes/gestion-inspecciones/gestion-inspecciones.component'
      },
      inspecAutomas: {
        name: 'inspecAutomas',
        path: '/inspec/app/components/administracion/automas/automas.component'
      },
      inspecTotales: {
        name: 'inspecTotales',
        path: '/inspec/app/components/administracion/perdidasyrobostotales/pyrtotales.component'
      },
      inspecExclusiones: {
        name: 'inspecExclusiones',
        path: '/inspec/app/components/administracion/exclusiones/exclusiones.component'
      },
      polyfill: {
        name: 'polyfill',
        path: '/inspec/app/polyfill'
      },
      inspecSolicitudNuevaTrec: {
        name: 'inspecSolicitudNuevaTrec',
        path: '/inspec/app/components/solicitudes/nueva-solicitud-trec/nueva-solicitud-trec.component'
      },
      inspectSolicitudNueva:{
        name: 'inspecSolicitudNueva',
        path: '/inspec/app/components/solicitudes/nueva-solicitud-trec/nueva-solicitud/nueva-solicitud.component'
      }
    },
    shim: {
      appInspec: {
        deps: [
          'polyfill',
          'angular_ui_route',
          'uIBootstrap',
          'oim_ocLazyLoad',
          'oim_layout',
          'lodash',
          'proxyLogin',
          'oim_security',
          'servicePoliza',
          'proxyInspec',
          'inspecFactory',
          'inspecConstant',
          'UserService'
        ]
      },
      inspecConstant: {
        deps: ['inspecFactory']
      },
      inspecSchedule: {
        deps: ['inspecCalendar']
      },
      inspecPreviewInspection: {
        deps: ['inspecCalendar']
      },
      inspecActionButton: {
        deps: ['ActionsHandlerService']
      },
      mpfActionButton: {
        deps: ['ActionsHandlerService']
      },
      inspecAlerts: {
        deps: ['inspecModalReplicate']
      },
      fullcalendarLanguage: {
        deps: ['fullcalendar']
      },
      mfSummary: {
        deps: ['angular']
      }
    },
    packages: {}
  };
});
