(function(factory) {
  define(factory);
})(function() {
  return {
    lib: {
      'cgw_routes': {
        name: 'cgw_routes',
        path: '/cgw/app/app.routes'
      },
      'appCgw': {
        name: 'appCgw',
        path: '/cgw/app/app'
      },
      'proxyPoliza': {
        name: 'proxyPoliza',
        path: '/polizas/app/proxy/servicePoliza'
      },
      'proxyCgw': {
        name: 'proxyCgw',
        path: '/cgw/app/proxy/serviceCgw'
      },
      'homeCgw': {
        name: 'CgwHomeController',
        path: '/cgw/app/home/controller/cgw-home.controller'
      },
      'CgwConsultaAuditorController': {
        name: 'CgwConsultaAuditorController',
        path: '/cgw/app/solicitudAuditoriaExt/controller/cgw-consulta-auditor.controller.js'
      },
      'DetalleConsultaAuditorController': {
        name: 'DetalleConsultaAuditorController',
        path: '/cgw/app/solicitudAuditoriaExt/controller/detalle-consulta-auditor.controller.js'
      },
      'SolicitudAuditoriaExternaController': {
        name: 'SolicitudAuditoriaExternaController',
        path: '/cgw/app/solicitudAuditoriaExt/controller/solicitud-auditoria-externa.controller.js'
      },
      'CgwConsultaController': {
        name: 'CgwConsultaController',
        path: '/cgw/app/consultaCG/controller/cgw-consulta.controller.js'
      },
      'DetalleConsultaAdminController': {
        name: 'DetalleConsultaAdminController',
        path: '/cgw/app/consultaCG/controller/detalle-consulta-admin.controller.js'
      },
      'DetalleConsultaClinicaController': {
        name: 'DetalleConsultaClinicaController',
        path: '/cgw/app/consultaCG/controller/detalle-consulta-clinica.controller.js'
      },
      'ReportesController': {
        name: 'ReportesController',
        path: '/cgw/app/reportes/controller/reportes.controller.js'
      },
      'CgwSolicitudTemplateController': {
        name: 'CgwSolicitudTemplateController',
        path: '/cgw/app/solicitudCG/controller/cgw-solicitud-template.controller.js'
      },
      'CgwSolicitud1Controller': {
        name: 'CgwSolicitud1Controller',
        path: '/cgw/app/solicitudCG/controller/cgw-solicitud-1.controller.js'
      },
      'CgwSolicitud2Controller': {
        name: 'CgwSolicitud2Controller',
        path: '/cgw/app/solicitudCG/controller/cgw-solicitud-2.controller.js'
      },
      'CgwSolicitud3Controller': {
        name: 'CgwSolicitud3Controller',
        path: '/cgw/app/solicitudCG/controller/cgw-solicitud-3.controller.js'
      },
      'CgwSolicitud4Controller': {
        name: 'CgwSolicitud4Controller',
        path: '/cgw/app/solicitudCG/controller/cgw-solicitud-4.controller.js'
      },
      'CgwSolicitud5Controller': {
        name: 'CgwSolicitud5Controller',
        path: '/cgw/app/solicitudCG/controller/cgw-solicitud-5.controller.js'
      },
      'CgwSolicitudResumenController': {
        name: 'CgwSolicitudResumenController',
        path: '/cgw/app/solicitudCG/controller/cgw-solicitud-resumen.controller.js'
      },
      'AltoCostoPacienteController': {
        name: 'AltoCostoPacienteController',
        path: '/cgw/app/altoCostoPaciente/controller/alto-costo-paciente.controller.js'
      },
      'AltoCostoSiniestroController': {
        name: 'AltoCostoSiniestroController',
        path: '/cgw/app/altoCostoSiniestro/controller/alto-costo-siniestro.controller.js'
      },
      CgwAsignarClinicaRolController: {
        name: "CgwAsignarClinicaRolController",
        path:
          "/cgw/app/asignarClinicaRol/controller/cgw-asignar-clinica-rol.controller.js",
      },
      DetalleAsignarClinicaRolController: {
        name: "DetalleAsignarClinicaRolController",
        path:
          "/cgw/app/asignarClinicaRol/controller/detalle-asignar-clinica-rol.controller.js",
      },
      CgwSumaAseguradaController: {
        name: "CgwSumaAseguradaController",
        path:
          "/cgw/app/sumaAsegurada/controller/cgw-suma-asegurada.controller.js",
      },
      CgwCondicionadoController: {
        name: "CgwCondicionadoController",
        path:
          "/cgw/app/condicionado/controller/cgw-condicionados.controller.js",
      },
      DetalleCondicionadoController: {
        name: "DetalleCondicionadoController",
        path:
          "/cgw/app/condicionado/controller/detalle-condicionado.controller.js",
      },
      CgwContactoFarmacoController: {
        name: "CgwContactoFarmacoController",
        path:
          "/cgw/app/contactoFarmacos/controller/cgw-contacto-farmaco.controller.js",
      },
      'mfpModalQuestion': {
        name: 'mfpModalQuestion',
        path: '/cgw/app/consultaCG/component/modalQuestion/modalQuestion.component'
      },
      'mfpModalGenerarInforme': {
        name: 'mfpModalGenerarInforme',
        path: '/cgw/app/solicitudAuditoriaExt/component/modalGenerarInforme/modalGenerarInforme.component'
      },
      'mfpModalBuscarDiagnostico': {
        name: 'mfpModalBuscarDiagnostico',
        path: '/cgw/app/consultaCG/component/modalBuscarDiagnostico/modalBuscarDiagnostico.component'
      },
      'mfpModalEditarBeneficio': {
        name: 'mfpModalEditarBeneficio',
        path: '/cgw/app/consultaCG/component/modalEditarBeneficio/modalEditarBeneficio.component'
      },
      'mfpModalAgregarDenuncia': {
        name: 'mfpModalAgregarDenuncia',
        path: '/cgw/app/consultaCG/component/modalAgregarDenuncia/modalAgregarDenuncia.component'
      },
      'mfpModalTarifas': {
        name: 'mfpModalTarifas',
        path: '/cgw/app/consultaCG/component/modalTarifas/modalTarifas.component'
      },
      'mfpModalAgregarCliente': {
        name: 'mfpModalAgregarCliente',
        path: '/cgw/app/reportes/component/modalAgregarCliente/modalAgregarCliente.component'
      },
      'mfpModalAgregarAfiliado': {
        name: 'mfpModalAgregarAfiliado',
        path: '/cgw/app/reportes/component/modalAgregarAfiliado/modalAgregarAfiliado.component'
      },
      mfpModalScanAuditoria: {
        name: "mfpModalScanAuditoria",
        path:
          "/cgw/app/consultaCG/component/modalScanAuditoria/modalScanAuditoria.component",
      },
      mfpModalDatosScanEdit: {
        name: "mfpModalDatosScanEdit",
        path:
          "/cgw/app/consultaCG/component/modalDatosScanEdit/modalDatosScanEdit.component",
      },
      mfpModalDatosScan: {
        name: "mfpModalDatosScan",
        path:
          "/cgw/app/consultaCG/component/modalDatosScan/modalDatosScan.component",
      },
      mfpModalAltosCostos: {
        name: "mfpModalAltosCostos",
        path:
          "/cgw/app/consultaCG/component/modalAltosCostos/modalAltosCostos.component",
      },
      mfpModalDatosCondicionado: {
        name: "mfpModalDatosCondicionado",
        path:
          "/cgw/app/consultaCG/component/modalDatosCondicionado/modalDatosCondicionado.component",
      },
      'mfpModalInvalidez': {
        name: 'mfpModalInvalidez',
        path: '/cgw/app/consultaCG/component/modalInvalidez/modalInvalidez.component'
      },
      'mfSummary': {
        name: 'mfSummary',
        path: '/cgw/app/solicitudCG/component/mf-summary.component'
      },
      'modalPresupuesto': {
        name: 'modalPresupuesto',
        path: '/cgw/app/solicitudCG/component/modalPresupuesto'
      },
      'modalTextArea': {
        name: 'modalTextArea',
        path: '/scripts/mpf-main-controls/components/modalTextArea/component/modalTextArea'
      },
      'modalPreExistencias': {
        name: 'modalPreExistencias',
        path: '/cgw/app/solicitudCG/component/modalPreExistencias'
      },
      'localStorageService': {
        name: 'localStorageService',
        path: '/scripts/b_components/angular-local-storage/dist/angular-local-storage.min'
      },
      'proxyEPS': {
        name: 'proxyEPS',
        path: '/cgw/app/proxy/servicePowerEPS'
      },
      'quill': {
        name: 'quill',
        path: '/scripts/plugins/quill.min'
      },
      'ngQuill': {
        name: 'ngQuill',
        path: '/scripts/b_components/ngQuill/src/ng-quill'
      },
      'generalConstants': {
        name: 'generalConstants',
        path: '/cgw/app/common/constants/general.constants'
      }
    },
    shim: {
      'appCgw': {
        deps: [
          'angular_ui_route',
          'uIBootstrap',
          'oim_ocLazyLoad',
          'oim_layout',
          'lodash',
          'proxyPoliza',
          'proxyLogin',
          'proxyCgw',
          'proxyEPS',
          'oim_security'
        ]
      },
      'proxyPoliza': { deps: ['wrap_gaia'] },
      'mfSummary': {deps: ['angular']},
      'localStorageService': {deps: ['angular']},
      'ngQuill': { deps: ['quill'] }
    },
    packages: {}
  };
});
