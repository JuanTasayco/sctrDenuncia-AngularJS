(function(factory) {
  define(factory);
})(function() {
  return {
    lib: {
      'grqc_routes': {
        name: 'grqc_routes',
        path: '/grqc/app/app.routes'
      },
      'appGrqc': {
        name: 'appGrqc',
        path: '/grqc/app/app'
      },
      'proxyPoliza': {
        name: 'proxyPoliza',
        path: '/polizas/app/proxy/servicePoliza'
      },
      'proxyGrqc': {
        name: 'proxyGrqc',
        path: '/grqc/app/proxy/serviceGrqc'
      },
      'homeGrqc': {
        name: 'GrqcHomeController',
        path: '/grqc/app/home/controller/grqc-home.controller'
      },
      'GrqcConsultaAuditorController': {
        name: 'GrqcConsultaAuditorController',
        path: '/grqc/app/bandejaGestionDetalle/controller/grqc-bandeja-requerimiento-detalle.controller.js'
      },
      'DetalleConsultaAuditorController': {
        name: 'DetalleConsultaAuditorController',
        path: '/grqc/app/bandejaGestionDetalle/controller/detalle-consulta-auditor.controller.js'
      },
      'SolicitudAuditoriaExternaController': {
        name: 'SolicitudAuditoriaExternaController',
        path: '/grqc/app/bandejaGestionDetalle/controller/solicitud-auditoria-externa.controller.js'
      },
      'GrqcConsultaController': {
        name: 'GrqcConsultaController',
        path: '/grqc/app/bandejeGestionSol/controller/grqc-bandeja-gestion.controller.js'
      },
      'grqcCondicionadoController': {
        name: 'grqcCondicionadoController',
        path: '/grqc/app/bandejaRequerimientos/controller/grqc-bandejaRequerimientos.controller.js'
      },
      'DetalleConsultaAdminController': {
        name: 'DetalleConsultaAdminController',
        path: '/grqc/app/bandejeGestionSol/controller/detalle-consulta-admin.controller.js'
      },
      'DetalleConsultaClinicaController': {
        name: 'DetalleConsultaClinicaController',
        path: '/grqc/app/bandejeGestionSol/controller/detalle-consulta-clinica.controller.js'
      },
      'ReportesController': {
        name: 'ReportesController',
        path: '/grqc/app/reportes/controller/reportes.controller.js'
      },
      'GrqcSolicitudTemplateController': {
        name: 'GrqcSolicitudTemplateController',
        path: '/grqc/app/solicitudCG/controller/grqc-solicitud-template.controller.js'
      },
      'GrqcSolicitud1Controller': {
        name: 'GrqcSolicitud1Controller',
        path: '/grqc/app/solicitudCG/controller/grqc-solicitud-1.controller.js'
      },
      'GrqcSolicitud2Controller': {
        name: 'GrqcSolicitud2Controller',
        path: '/grqc/app/solicitudCG/controller/grqc-solicitud-2.controller.js'
      },
      'GrqcSolicitud3Controller': {
        name: 'GrqcSolicitud3Controller',
        path: '/grqc/app/solicitudCG/controller/grqc-solicitud-3.controller.js'
      },
      'GrqcSolicitud4Controller': {
        name: 'GrqcSolicitud4Controller',
        path: '/grqc/app/solicitudCG/controller/grqc-solicitud-4.controller.js'
      },
      'GrqcSolicitud5Controller': {
        name: 'GrqcSolicitud5Controller',
        path: '/grqc/app/solicitudCG/controller/grqc-solicitud-5.controller.js'
      },
      'GrqcSolicitudResumenController': {
        name: 'GrqcSolicitudResumenController',
        path: '/grqc/app/solicitudCG/controller/grqc-solicitud-resumen.controller.js'
      },
      'AltoCostoPacienteController': {
        name: 'AltoCostoPacienteController',
        path: '/grqc/app/altoCostoPaciente/controller/alto-costo-paciente.controller.js'
      },
      'AltoCostoSiniestroController': {
        name: 'AltoCostoSiniestroController',
        path: '/grqc/app/altoCostoSiniestro/controller/alto-costo-siniestro.controller.js'
      },
      GrqcAsignarClinicaRolController: {
        name: "GrqcAsignarClinicaRolController",
        path:
          "/grqc/app/asignarClinicaRol/controller/grqc-asignar-clinica-rol.controller.js",
      },
      DetalleAsignarClinicaRolController: {
        name: "DetalleAsignarClinicaRolController",
        path:
          "/grqc/app/asignarClinicaRol/controller/detalle-asignar-clinica-rol.controller.js",
      },
      GrqcSumaAseguradaController: {
        name: "GrqcSumaAseguradaController",
        path:
          "/grqc/app/sumaAsegurada/controller/grqc-suma-asegurada.controller.js",
      },
      GrqcCondicionadoController: {
        name: "GrqcCondicionadoController",
        path:
          "/grqc/app/condicionado/controller/grqc-bandejaRequerimientos.controller.js",
      },
      DetalleCondicionadoController: {
        name: "DetalleCondicionadoController",
        path:
          "/grqc/app/condicionado/controller/detalle-condicionado.controller.js",
      },
      GrqcContactoFarmacoController: {
        name: "GrqcContactoFarmacoController",
        path:
          "/grqc/app/contactoFarmacos/controller/grqc-bandeja-gestion-detalle.controller.js",
      },
      'mfpModalQuestion': {
        name: 'mfpModalQuestion',
        path: '/grqc/app/bandejeGestionSol/component/modalQuestion/modalQuestion.component'
      },
      'mfpModalGenerarInforme': {
        name: 'mfpModalGenerarInforme',
        path: '/grqc/app/bandejaGestionDetalle/component/modalGenerarInforme/modalGenerarInforme.component'
      },
      'mfpModalBuscarDiagnostico': {
        name: 'mfpModalBuscarDiagnostico',
        path: '/grqc/app/bandejeGestionSol/component/modalBuscarDiagnostico/modalBuscarDiagnostico.component'
      },
      'mfpModalEditarBeneficio': {
        name: 'mfpModalEditarBeneficio',
        path: '/grqc/app/bandejeGestionSol/component/modalEditarBeneficio/modalEditarBeneficio.component'
      },
      'mfpModalAgregarDenuncia': {
        name: 'mfpModalAgregarDenuncia',
        path: '/grqc/app/bandejeGestionSol/component/modalAgregarDenuncia/modalAgregarDenuncia.component'
      },
      'mfpModalTarifas': {
        name: 'mfpModalTarifas',
        path: '/grqc/app/bandejeGestionSol/component/modalTarifas/modalTarifas.component'
      },
      'mfpModalAgregarCliente': {
        name: 'mfpModalAgregarCliente',
        path: '/grqc/app/reportes/component/modalAgregarCliente/modalAgregarCliente.component'
      },
      'mfpModalAgregarAfiliado': {
        name: 'mfpModalAgregarAfiliado',
        path: '/grqc/app/reportes/component/modalAgregarAfiliado/modalAgregarAfiliado.component'
      },
      mfpModalScanAuditoria: {
        name: "mfpModalScanAuditoria",
        path:
          "/grqc/app/bandejeGestionSol/component/modalScanAuditoria/modalScanAuditoria.component",
      },
      mfpModalDatosScanEdit: {
        name: "mfpModalDatosScanEdit",
        path:
          "/grqc/app/bandejeGestionSol/component/modalDatosScanEdit/modalDatosScanEdit.component",
      },
      mfpModalDatosScan: {
        name: "mfpModalDatosScan",
        path:
          "/grqc/app/bandejeGestionSol/component/modalDatosScan/modalDatosScan.component",
      },
      mfpModalAltosCostos: {
        name: "mfpModalAltosCostos",
        path:
          "/grqc/app/bandejeGestionSol/component/modalAltosCostos/modalAltosCostos.component",
      },
      mfpModalDatosCondicionado: {
        name: "mfpModalDatosCondicionado",
        path:
          "/grqc/app/bandejeGestionSol/component/modalDatosCondicionado/modalDatosCondicionado.component",
      },
      'mfSummary': {
        name: 'mfSummary',
        path: '/grqc/app/solicitudCG/component/mf-summary.component'
      },
      'modalPresupuesto': {
        name: 'modalPresupuesto',
        path: '/grqc/app/solicitudCG/component/modalPresupuesto'
      },
      'modalTextArea': {
        name: 'modalTextArea',
        path: '/scripts/mpf-main-controls/components/modalTextArea/component/modalTextArea'
      },
      'modalPreExistencias': {
        name: 'modalPreExistencias',
        path: '/grqc/app/solicitudCG/component/modalPreExistencias'
      },
      'localStorageService': {
        name: 'localStorageService',
        path: '/scripts/b_components/angular-local-storage/dist/angular-local-storage.min'
      },
      'proxyEPS': {
        name: 'proxyEPS',
        path: '/grqc/app/proxy/servicePowerEPS'
      },
      'quill': {
        name: 'quill',
        path: '/scripts/plugins/quill.min'
      },
      'ngQuill': {
        name: 'ngQuill',
        path: '/scripts/b_components/ngQuill/src/ng-quill'
      }
    },
    shim: {
      'appGrqc': {
        deps: [
          'angular_ui_route',
          'uIBootstrap',
          'oim_ocLazyLoad',
          'oim_layout',
          'lodash',
          'proxyPoliza',
          'proxyLogin',
          'proxyGrqc',
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
