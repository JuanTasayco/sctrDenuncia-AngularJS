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
          moduleName: 'appCgw',
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
      name: 'homeCgw',
      code: '',
      url: '/',
      description: 'Carta de garantía',
      parent: 'root',
      views: {
        content: {
          controller: 'CgwHomeController',
          templateUrl: '/cgw/app/home/controller/cartas-home.html'
        }
      },
      resolver: [
        {
          name: 'homeCgw',
          moduleName: 'appCgw',
          files: [
            '/cgw/app/home/controller/cgw-home.controller.js'
          ]
        }
      ]
    },
    {
      name: 'consultaAuditorCgw',
      code: '',
      url: '/consultaCartasAuditor',
      description: 'Consulta de Cartas para auditor externo',
      parent: 'root',
      views: {
        content: {
          controller: 'CgwConsultaAuditorController',
          templateUrl: '/cgw/app/solicitudAuditoriaExt/controller/consulta.html',
          controllerAs: 'vm'
        }
      },
      resolve: {
        formularioEstadosCarta: ['loaderConsultaAuditoriaCGW', 'consultaAuditorCgw', function(loaderConsultaAuditoriaCGW, consultaAuditorCgw){
          return loaderConsultaAuditoriaCGW.initEstadosCarta();
        }],
        formularioEmpresas: ['loaderConsultaAuditoriaCGW', 'consultaAuditorCgw' , function(loaderConsultaAuditoriaCGW, consultaAuditorCgw){
          return loaderConsultaAuditoriaCGW.initListEmpresas();
        }]
      },
      resolver: [
        {
          name: 'consultaAuditorCgw',
          moduleName: 'appCgw',
          files: [
            '/cgw/app/solicitudAuditoriaExt/controller/cgw-consulta-auditor.controller.js'
          ]
        }
      ]
    },
    {
      name: 'detalleConsultaAuditor',
      code: '',
      url: '/consultaCartasAuditor/detalle/:id/:year/:version/:cia/:auditNumber/:flag',
      description: 'Detalle Carta de garantía',
      parent: 'root',
      views: {
        content: {
          controller: 'DetalleConsultaAuditorController',
          templateUrl: '/cgw/app/solicitudAuditoriaExt/controller/detalleConsultaAuditor.html'
        }
      },
      resolver: [
        {
          name: 'detalleConsultaAuditor',
          moduleName: 'appCgw',
          files: [
            '/cgw/app/solicitudAuditoriaExt/controller/detalle-consulta-auditor.controller.js'
          ]
        }
      ]
    },
    {
      name: 'reportes',
      code: '',
      url: '/reportes',
      description: 'Reportes',
      parent: 'root',
      views: {
        content: {
          controller: 'ReporteController',
          templateUrl: '/cgw/app/reportes/controller/reportes.html'
        }
      },
      resolve: {
        formularioEstadosCarta: ['loaderReporteCGW', 'reportes', function(loaderReporteCGW, reportes){
          return loaderReporteCGW.initEstadosCarta();
        }],
        formularioEjecutivos: ['loaderReporteCGW', 'reportes' , function(loaderReporteCGW, reportes){
          return loaderReporteCGW.initListEjecutivos();
        }],
        formularioEmpresas: ['loaderReporteCGW', 'reportes' , function(loaderReporteCGW, reportes){
          return loaderReporteCGW.initListEmpresas();
        }],
        formularioEstadosScan: ['loaderReporteCGW', 'reportes', function(loaderReporteCGW, reportes){
          return loaderReporteCGW.initEstadosScan();
        }],
      },
      resolver: [
        {
          name: 'reportes',
          moduleName: 'appCgw',
          files: [
            '/cgw/app/reportes/controller/reportes.controller.js'
          ]
        }
      ]
    },
    {
      name: 'mantenimientos',
      code: '',
      url: '/mantenimientos',
      description: 'Mantenimientos',
      parent: 'root',
      views: {
        content: {
          controller: 'MantenimientosController as $ctrl',
          templateUrl: '/cgw/app/mantenimientos/controller/mantenimientos.html'
        }
      },
      resolver: [
        {
          name: 'mantenimientos',
          moduleName: 'appCgw',
          files: [
            '/cgw/app/mantenimientos/controller/mantenimientos.controller.js'
          ]
        }
      ]
    },
    {
      name: 'consultaCgw',
      code: '',
      url: '/consultaCartas',
      description: 'Consulta Carta de garantía',
      parent: 'root',
      views: {
        content: {
          controller: 'CgwConsultaController',
          templateUrl: '/cgw/app/consultaCG/controller/consulta.html',
          controllerAs: 'vm'
        }
      },
      resolve: {
        formularioEstadosCarta: ['loaderConsultaCGW', 'consultaCgw', function(loaderConsultaCGW, consultaCgw){
          return loaderConsultaCGW.initEstadosCarta();
        }],
        formularioEjecutivos: ['loaderConsultaCGW', 'consultaCgw' , function(loaderConsultaCGW, consultaCgw){
          return loaderConsultaCGW.initListEjecutivos();
        }],
        formularioEjecutivosAsignados: ['loaderConsultaCGW', 'consultaCgw' , function(loaderConsultaCGW, consultaCgw){
          return loaderConsultaCGW.initListEjecutivosAsignados();
        }],
        formularioEmpresas: ['loaderConsultaCGW', 'consultaCgw' , function(loaderConsultaCGW, consultaCgw){
          return loaderConsultaCGW.initListEmpresas();
        }]
      },
      resolver: [
        {
          name: 'consultaCgw',
          moduleName: 'appCgw',
          files: [
            '/cgw/app/consultaCG/controller/cgw-consulta.controller.js'
          ]
        }
      ]
    },
    {
      name: 'detalleConsultaAdmin',
      code: '',
      url: '/consultaCartas/detalle/:id/:year/:version/:cia/:flag/:state',
      description: 'Detalle Carta de garantía',
      breads: ['consultaCgw'],
      parent: 'root',
      views: {
        content: {
          controller: 'DetalleConsultaAdminController',
          templateUrl: '/cgw/app/consultaCG/controller/detalleConsultaAdmin.html'
        }
      },
      resolver: [
        {
          name: 'detalleConsultaAdmin',
          moduleName: 'appCgw',
          files: [
            '/cgw/app/consultaCG/controller/detalle-consulta-admin.controller.js'
          ]
        }
      ]
    },
    {
      name: 'detalleConsultaClinica',
      code: '',
      url: '/consultaCartas/detalle/:id/:year/:version/:cia/:flag/:state',
      description: 'Detalle Carta de garantía',
      breads: ['consultaCgw'],
      parent: 'root',
      views: {
        content: {
          controller: 'DetalleConsultaClinicaController',
          templateUrl: '/cgw/app/consultaCG/controller/detalleConsultaClinica.html'
        }
      },
      resolver: [
        {
          name: 'detalleConsultaClinica',
          moduleName: 'appCgw',
          files: [
            '/cgw/app/consultaCG/controller/detalle-consulta-clinica.controller.js'
          ]
        }
      ]
    },
    {
      name: 'historialAfiliado',
      code: '',
      url: '/historialAfiliado/:id/:year/:version/:cia/:start/:end',
      description: 'Historial Afiliado',
      breads: ['consultaCgw'],
      parent: 'root',
      views: {
        content: {
          controller: 'ModalHistorialController',
          templateUrl: '/cgw/app/consultaCG/component/modalHistorial/modalHistorial.html'
        }
      },
      resolver: [
        {
          name: 'historialAfiliado',
          moduleName: 'appCgw',
          files: [
            '/cgw/app/consultaCG/component/modalHistorial/modalHistorial.component.js'
          ]
        }
      ]
    },
    {
      name: 'levantarObservacion',
      code: '',
      url: '/consultaCartas/levantarObservacion/:id/:year/:version/:cia/:flag',///:id/:year/:version/:cia/:flag',
      description: 'Levantar Observación',
      parent: 'root',
      breads: ['consultaCgw'],
      views: {
        content: {
          controller: 'LevantarObservacionController',
          templateUrl: '/cgw/app/consultaCG/component/levantarObservacion.html'
        }
      },
      resolver: [
        {
          name: 'levantarObservacion',
          moduleName: 'appCgw',
          files: [
            '/cgw/app/consultaCG/controller/levantarObservacion.js'
          ]
        }
      ]
    },
    {
      name: 'generarAmpliacion',
      code: '',
      url: '/consultaCartas/generarAmpliacion/:id/:year/:version/:cia/:flag',//:id/:year/:version/:cia/:flag',
      description: 'Generar Ampliación',
      parent: 'root',
      breads: ['consultaCgw'],
      views: {
        content: {
          controller: 'generarAmpliacionController',
          templateUrl: '/cgw/app/consultaCG/component/generarAmpliacion.html'
        }
      },
      resolver: [
        {
          name: 'generarAmpliacion',
          moduleName: 'appCgw',
          files: [
            '/cgw/app/consultaCG/controller/generarAmpliacion.js'
          ]
        }
      ]
    },
    {
      name: 'solicitudCgw',
      code: '',
      description: 'Solicitud Cartas de Garantias',
      params: { step: null },
      breads: ['homeCgw'],
      urls: [
        {
          url: '/solicitudCgw',
          parent: 'root',
          thenRoutes: ['/solicitudCgw/1'],
          views: {
            content: {
              controller: 'CgwSolicitudTemplateController',
              templateUrl: '/cgw/app/solicitudCG/controller/cgw-solicitud-template.html'
            }
          }
        },
        {
          name: 'solicitudCgw.steps',
          url: '/:step/:id',
          params : {
            step: "1",
            id : "0"
          },
          templateUrl: function($stateParam) {
            var c = [
              undefined,
              '/cgw/app/solicitudCG/component/cgw-solicitud-1.html',
              '/cgw/app/solicitudCG/component/cgw-solicitud-2.html',
              '/cgw/app/solicitudCG/component/cgw-solicitud-3.html',
              '/cgw/app/solicitudCG/component/cgw-solicitud-4.html'
            ];
            return c[$stateParam.step];
          },
          controllerProvider: function($stateParams) {
            var c = [
              undefined,
              'CgwSolicitud1Controller',
              'CgwSolicitud2Controller',
              'CgwSolicitud3Controller',
              'CgwSolicitud4Controller'
            ];

            return c[$stateParams.step];
          }
        },
        {
          name: 'solicitudCgw.stepsSoat',
          url: '/2.0/:step/:id',
          params : {
            step: "1",
            id : "0"
          },
          templateUrl: function($stateParam) {
            var c = [
              undefined,
              '/cgw/app/solicitudCG/component/cgw-solicitud-ubigeo.html',
              '/cgw/app/solicitudCG/component/cgw-solicitud-diag.html',
              '/cgw/app/solicitudCG/component/cgw-solicitud-cob.html',
              '/cgw/app/solicitudCG/component/cgw-solicitud-presup.html'
            ];

            return c[$stateParam.step];
          },
          controllerProvider: function($stateParams) {
            var c = [
              undefined,
              'CgwSolicitudUbigeoController',
              'CgwSolicitudDiagController',
              'CgwSolicitudCobController',
              'CgwSolicitudPresupController'
            ];

            return c[$stateParams.step];
          }
        },
        {
          name: 'solicitudCgw.stepsAAPP',
          url: '/2.0/:step/:id',
          params : {
            step: "1",
            id : "0"
          },
          templateUrl: function($stateParam) {
            var c = [
              undefined,
              '/cgw/app/solicitudCG/component/cgw-solicitud-ubigeo.html',
              '/cgw/app/solicitudCG/component/cgw-solicitud-diag.html',
              '/cgw/app/solicitudCG/component/cgw-solicitud-cob.html',
              '/cgw/app/solicitudCG/component/cgw-solicitud-presup.html'
            ];

            return c[$stateParam.step];
          },
          controllerProvider: function($stateParams) {
            var c = [
              undefined,
              'CgwSolicitudUbigeoController',
              'CgwSolicitudDiagController',
              'CgwSolicitudCobController',
              'CgwSolicitudPresupController'
            ];

            return c[$stateParams.step];
          }
        }
      ],
      resolver: [
        {
          name: 'solicitudCgw',
          moduleName: 'appCgw',
          files: [
            '/cgw/app/solicitudCG/controller/cgw-solicitud-template.controller.js',
            '/cgw/app/solicitudCG/controller/cgw-solicitud-1.controller.js',
            '/cgw/app/solicitudCG/controller/cgw-solicitud-2.controller.js',
            '/cgw/app/solicitudCG/controller/cgw-solicitud-3.controller.js',
            '/cgw/app/solicitudCG/controller/cgw-solicitud-4.controller.js',
            '/cgw/app/solicitudCG/controller/cgw-solicitud-ubigeo.controller.js',
            '/cgw/app/solicitudCG/controller/cgw-solicitud-diag.controller.js',
            '/cgw/app/solicitudCG/controller/cgw-solicitud-cob.controller.js',
            '/cgw/app/solicitudCG/controller/cgw-solicitud-presup.controller.js'
          ]
        }
      ]
    },
    {
      name: 'solicitudCgw.resumen',
      code: '',
      url: '/resumen',
      description: 'Carta de garantía Resumen',
      parent: 'root',
      views: {
        content: {
          controller: 'CgwSolicitudResumenController',
          templateUrl: '/cgw/app/solicitudCG/controller/cgw-solicitud-resumen.html'
        }
      },
      resolver: [
        {
          name: 'solicitudCgw.resumen',
          moduleName: 'appCgw',
          files: [
            '/cgw/app/solicitudCG/controller/cgw-solicitud-resumen.controller.js'
          ]
        }
      ]
    },
    {
      name: 'altoCostoPaciente',
      code: '',
      url: '/altoCostoPaciente',
      description: 'Reporte de Altos Costos Paciente',
      parent: 'root',
      views: {
        content: {
          controller: 'AltoCostoPacienteController',
          templateUrl: '/cgw/app/altoCostoPaciente/controller/altoCostoPaciente.html',
          controllerAs: 'vm'
        }
      },
      resolve: {
        formularioEmpresas: ['loaderAltoCostoPaciente', 'altoCostoPaciente' , function(loaderAltoCostoPaciente, altoCostoPaciente){
          return loaderAltoCostoPaciente.initListEmpresas();
        }]
      },
      resolver: [
        {
          name: 'altoCostoPaciente',
          moduleName: 'appCgw',
          files: [
            '/cgw/app/altoCostoPaciente/controller/alto-costo-paciente.controller.js'
          ]
        }
      ]
    },
    {
      name: 'detalleAltoCostoPaciente',
      code: '',
      url: '/altoCostoPaciente/detalle/:cia/:afiliado/:contrato/:plan',
      description: 'Detalle Alto Costo Paciente',
      breads: ['altoCostoPaciente'],
      parent: 'root',
      views: {
        content: {
          controller: 'DetalleAltoCostoPacienteController',
          templateUrl: '/cgw/app/altoCostoPaciente/controller/detalleAltoCostoPaciente.html'
        }
      },
      resolver: [
        {
          name: 'detalleAltoCostoPaciente',
          moduleName: 'appCgw',
          files: [
            '/cgw/app/altoCostoPaciente/controller/detalle-alto-costo-paciente.controller.js'
          ]
        }
      ]
    },
    {
      name: 'altoCostoSiniestro',
      code: '',
      url: '/altoCostoSiniestro',
      description: 'Reporte de Altos Costos Siniestros CG',
      parent: 'root',
      views: {
        content: {
          controller: 'AltoCostoSiniestroController',
          templateUrl: '/cgw/app/altoCostoSiniestro/controller/altoCostoSiniestro.html',
          controllerAs: 'vm'
        }
      },
      resolve: {
        formularioEstadosCarta: ['loaderAltoCostoSiniestro', 'altoCostoSiniestro', function(loaderAltoCostoSiniestro, altoCostoSiniestro){
          return loaderAltoCostoSiniestro.initEstadosCarta();
        }],
        formularioEjecutivos: ['loaderAltoCostoSiniestro', 'altoCostoSiniestro' , function(loaderAltoCostoSiniestro, altoCostoSiniestro){
          return loaderAltoCostoSiniestro.initListEjecutivos();
        }],
        formularioEmpresas: ['loaderAltoCostoSiniestro', 'altoCostoSiniestro' , function(loaderAltoCostoSiniestro, altoCostoSiniestro){
          return loaderAltoCostoSiniestro.initListEmpresas();
        }]
      },
      resolver: [
        {
          name: 'altoCostoSiniestro',
          moduleName: 'appCgw',
          files: [
            '/cgw/app/altoCostoSiniestro/controller/alto-costo-siniestro.controller.js'
          ]
        }
      ]
    },
    {
      name: 'asignarClinicaRol',
      code: '',
      url: '/asignarClinicaRol',
      description: 'Asignación de Clínicas y CIE10 por rol',
      parent: 'root',
      views: {
        content: {
          controller: 'CgwAsignarClinicaRolController',
          templateUrl: '/cgw/app/asignarClinicaRol/controller/cgw-asignar-clinica-rol.html'
        }
      },
      resolver: [
        {
          name: 'asignarClinicaRol',
          moduleName: 'appCgw',
          files: [
            '/cgw/app/asignarClinicaRol/controller/cgw-asignar-clinica-rol.controller.js'
          ]
        }
      ]
    },
    {
      name: 'detalleAsignarClinicaRol',
      code: '',
      url: '/detalleAsignarClinicaRol/:id/:rol/:usuario',
      description: 'Detalle',
      breads: ['asignarClinicaRol'],
      parent: 'root',
      views: {
        content: {
          controller: 'DetalleAsignarClinicaRolController',
          templateUrl: '/cgw/app/asignarClinicaRol/controller/detalle-asignar-clinica-rol.html'
        }
      },
      resolver: [
        {
          name: 'detalleAsignarClinicaRol',
          moduleName: 'appCgw',
          files: [
            '/cgw/app/asignarClinicaRol/controller/detalle-asignar-clinica-rol.controller.js'
          ]
        }
      ]
    },
    {
      name: 'sumaAsegurada',
      code: '',
      url: '/sumaAsegurada',
      description: 'Suma Asegurada EPS',
      parent: 'root',
      views: {
        content: {
          controller: 'CgwSumaAseguradaController',
          templateUrl: '/cgw/app/sumaAsegurada/controller/cgw-suma-asegurada.html'
        }
      },
      resolver: [
        {
          name: 'sumaAsegurada',
          moduleName: 'appCgw',
          files: [
            '/cgw/app/sumaAsegurada/controller/cgw-suma-asegurada.controller.js'
          ]
        }
      ]
    },
    {
      name: 'condicionados',
      code: '',
      url: '/condicionados',
      description: 'Condicionados',
      parent: 'root',
      views: {
        content: {
          controller: 'CgwCondicionadoController',
          templateUrl: '/cgw/app/condicionados/controller/cgw-condicionados.html'
        }
      },
      resolve: {
        formularioEmpresas: ['loaderCondicionadosCGW', 'condicionados' , function(loaderCondicionadosCGW, condicionados){
          return loaderCondicionadosCGW.initListEmpresas();
        }]
      },
      resolver: [
        {
          name: 'condicionados',
          moduleName: 'appCgw',
          files: [
            '/cgw/app/condicionados/controller/cgw-condicionados.controller.js'
          ]
        }
      ]
    },
    {
      name: 'detalleCondicionado',
      code: '',
      url: '/detalleCondicionado/:id',
      description: 'Detalle de Condicionado',
      breads: ['condicionados'],
      parent: 'root',
      views: {
        content: {
          controller: 'DetalleCondicionadoController',
          templateUrl: '/cgw/app/condicionados/controller/detalle-condicionado.html'
        }
      },
      resolve: {
        formularioEmpresas: ['loaderDetalleCondicionadoCGW', 'detalleCondicionado' , function(loaderDetalleCondicionadoCGW, detalleCondicionado){
          return loaderDetalleCondicionadoCGW.initListEmpresas();
        }]
      },
      resolver: [
        {
          name: 'detalleCondicionado',
          moduleName: 'appCgw',
          files: [
            '/cgw/app/condicionados/controller/detalle-condicionado.controller.js'
          ]
        }
      ]
    },
    {
      name: 'contactoFarmaco',
      code: '',
      url: '/contactoFarmaco',
      description: 'Contactos de Fármacos de Altos Costos',
      parent: 'root',
      views: {
        content: {
          controller: 'CgwContactoFarmacoController',
          templateUrl: '/cgw/app/contactoFarmaco/controller/cgw-contacto-farmaco.html'
        }
      },
      resolver: [
        {
          name: 'contactoFarmaco',
          moduleName: 'appCgw',
          files: [
            '/cgw/app/contactoFarmaco/controller/cgw-contacto-farmaco.controller.js'
          ]
        }
      ]
    },
    {
      name: 'rechazarCarta',
      code: '',
      url: '/rechazarCarta/:id/:year/:version/:cia/',
      description: 'Rechazar Carta de Garantía',
      breads: ['consultaCgw'],
      parent: 'root',
      views: {
        content: {
          controller: 'ModalRechazarCartaController',
          templateUrl: '/cgw/app/consultaCG/component/modalRechazarCarta/modalRechazarCarta.html'
        }
      },
      resolver: [
        {
          name: 'rechazarCarta',
          moduleName: 'appCgw',
          files: [
            '/cgw/app/consultaCG/component/modalRechazarCarta/modalRechazarCarta.component.js'
          ]
    }
      ]
    },
  ];

  return data;
});
