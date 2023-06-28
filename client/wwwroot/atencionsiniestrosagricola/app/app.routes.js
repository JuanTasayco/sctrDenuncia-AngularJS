(function ($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, "atencionsiniestrosagricolaRoutes", [],
  function () {
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
          authorizedResource: ['accessSupplier', function (accessSupplier) {
            return accessSupplier.getAllObject();
          }]
        },
        resolver: [{
          name: "layout",
          moduleName: "oim.layout",
          files: ['topController',
            'headerController',
            'leftBarController',
            'bodyMiddelController',
            'bodyLeftController',
            'rightBarController',
            'footerController',
            'bottomController'
          ],
        }]
      },
      {
        name: 'home',
        appCode: '',
        description: '',
        url: '/',
        parent: 'root',
        views: {
          content: {
            controller: 'HomeController',
            templateUrl: '/atencionsiniestrosagricola/app/home/home.html'
          }
        },
        resolver: [
          {
            name: 'home',
            moduleName: 'atencionsiniestrosagricola.app',
            files: [
              'HomeController',
              'formAviso'
            ]
          }
        ]
      },
      {
        name: 'kpiSiniestro',
        appCode: '',
        description: 'Siniestros',
        url: '/kpiSiniestro',
        parent: 'root',
        views: {
          content: {
            controller: 'KpiSiniestroController',
            templateUrl: '/atencionsiniestrosagricola/app/kpiSiniestro/kpiSiniestro.html'
          }
        },
        resolver: [
          {
            name: 'kpiSiniestro',
            moduleName: 'atencionsiniestrosagricola.app',
            files: [
              'KpiSiniestroController',
              'tabProducts',
              'formFilters',
              'modalFormFilters',
              'listFilters',
              'chartComponent',
              'modalChartData'
            ]
          }
        ]
      },
      {
        name: 'kpiCgw',
        appCode: '',
        description: 'Cartas de Garantía',
        url: '/kpiCgw',
        parent: 'root',
        views: {
          content: {
            controller: 'KpiCgwController',
            templateUrl: '/atencionsiniestrosagricola/app/kpiCgw/kpiCgw.html'
          }
        },
        resolver: [
          {
            name: 'kpiCgw',
            moduleName: 'atencionsiniestrosagricola.app',
            files: [
              'KpiCgwController',
              'tabProducts',
              'formFilters',
              'modalFormFilters',
              'listFilters',
              'chartComponent',
              'chartTextComponent',
              'modalChartData'
            ]
          }
        ]
      },
      {
        name: 'kpiConfiguracion',
        appCode: '',
        description: 'Configuración',
        url: '/kpiConfiguracion',
        parent: 'root',
        views: {
          content: {
            controller: 'KpiConfiguracionController',
            templateUrl: '/atencionsiniestrosagricola/app/kpiConfiguracion/kpiConfiguracion.html'
          }
        },
        resolver: [
          {
            name: 'kpiConfiguracion',
            moduleName: 'atencionsiniestrosagricola.app',
            files: [
              'KpiConfiguracionController',
              'formSetting'
            ]
          }
        ]
      },
      {
        name: 'registrarAviso',
        appCode: '',
        description: 'Registrar aviso',
        url: '/registrarAviso',
        parent: 'root',
        views: {
          content: {
            controller: 'RegistrarAvisoController',
            templateUrl: '/atencionsiniestrosagricola/app/aviso/registrarAviso.html'
          }
        },
        resolver: [
          {
            name: 'registrarAviso',
            moduleName: 'atencionsiniestrosagricola.app',
            files: [
              'RegistrarAvisoController',
              'formAviso',
              'ModalContacto'
            ]
          }
        ]
      },
      {
        name: 'consultaAvisoSiniestro',
        code: '',
        url: '/consultaAvisoSiniestro',
        description: 'Bandeja de avisos siniestro',
        parent: 'root',
        views: {
          content: {
            controller: 'ConsultaAvisoSiniestroController',
            templateUrl: '/atencionsiniestrosagricola/app/consultaAvisoSiniestro/components/consulta-aviso-siniestro.html',
            controllerAs: 'vm'
          }
        },
        resolver: [
          {
            name: 'consultaAvisoSiniestro',
            moduleName: 'atencionsiniestrosagricola.app',
            files: [
              '/atencionsiniestrosagricola/app/consultaAvisoSiniestro/controllers/consulta-aviso-siniestro.js'
            ]
          }
        ]
      },
      {
        name: 'detalleConsultaAvisoSiniestro', 
        code: '', 
        url: '/consultaAvisoSiniestro/detalle/:idCampania/:idAviso',
        description: 'Detalle aviso siniestro', 
        breads: ['consultaAvisoSiniestro'], 
        parent: 'root', 
        views: {
          content:{
            controller: 'DetalleAvisoSiniestroController', 
            templateUrl: '/atencionsiniestrosagricola/app/consultaAvisoSiniestro/components/detalle-aviso-siniestro.html'
          }
        }, 
        resolver: [
          {
            name: 'detalleAvisoSiniestro', 
            moduleName: 'atencionsiniestrosagricola.app',
            files: [
              '/atencionsiniestrosagricola/app/consultaAvisoSiniestro/controllers/detalle-aviso-siniestro-controller.js',
              'ModalReapertura'
            ]
          }
        ]
      },
      {
        name: 'campanias',
        code: '',
        url: '/campanias',
        description: 'Campañas',
        parent: 'root',
        views: {
          content: {
            controller: 'ConsultaCampaniaController',
            templateUrl: '/atencionsiniestrosagricola/app/campanias/components/consulta-campania.html',
            controllerAs: 'vm'
          }
        },
        resolver: [
          {
            name: 'campanias',
            moduleName: 'atencionsiniestrosagricola.app',
            files: [
              '/atencionsiniestrosagricola/app/campanias/controllers/consulta-campania.js'
            ]
          }
        ]
      },
      {
        name: 'formCampania',
        code: '',
        url: '/formCampania',
        description: 'Campañas',
        params: {
          campania: null,
          edit: null
        },
        parent: 'root',
        views: {
          content: {
            controller: 'FormCampaniaController',
            templateUrl: '/atencionsiniestrosagricola/app/campanias/components/form-campania.html',
            controllerAs: 'vm'
          }
        },
        resolver: [
          {
            name: 'formCampania',
            moduleName: 'atencionsiniestrosagricola.app',
            files: [
              '/atencionsiniestrosagricola/app/campanias/controllers/form-campania.js'
            ]
          }
        ]
      },
      {
        name: 'detalleCampania',
        code: '',
        url: '/campanias/detalle/:id',
        breads: ['campanias'],
        params: {
          campania: null
        },
        description: 'Detalle de Campañas',
        parent: 'root',
        views: {
          content: {
            controller: 'DetalleCampaniaController',
            templateUrl: '/atencionsiniestrosagricola/app/campanias/components/detalle-campania.html',
            controllerAs: 'vm'
          }
        },
        resolver: [
          {
            name: 'detalleCampania',
            moduleName: 'atencionsiniestrosagricola.app',
            files: [
              '/atencionsiniestrosagricola/app/campanias/controllers/detalle-campania.js',
              'tabUsuarioCampania',
              'tabGrupoCultivoCampania',
              'tabGrupoParametroCampania',
              'tabSectorEstadCampania',
              'tabRelSectorCultivoCampania'
            ]
          }
        ]
      },
      {
        name: 'bandejaReportes',
        code: '',
        url: '/reportes',
        description: 'Reportes',
        parent: 'root',
        views: {
          content: {
            controller: 'bandejaReportesController',
            templateUrl: '/atencionsiniestrosagricola/app/reportes/components/bandeja-reportes.html',
            controllerAs: 'vm'
          }
        },
        resolver: [
          {
            name: 'bandejaReportes',
            moduleName: 'atencionsiniestrosagricola.app',
            files: [
              '/atencionsiniestrosagricola/app/reportes/controllers/bandeja-reportes.js'
            ]
          }
        ]
      },
      {
        name: 'adjuntarPadron',
        code: '',
        url: '/adjuntarPadron',
        description: 'Reportes',
        params: {
          aviso: null
        },
        parent: 'root',
        views: {
          content: {
            controller: 'AdjuntarPadronController',
            templateUrl: '/atencionsiniestrosagricola/app/reportes/components/adjuntar-padron.html',
            controllerAs: 'vm'
          }
        },
        resolver: [
          {
            name: 'adjuntarPadron',
            moduleName: 'atencionsiniestrosagricola.app',
            files: [
              '/atencionsiniestrosagricola/app/reportes/controllers/adjuntar-padron.js'
            ]
          }
        ]
      },
      {
        name: 'consultaSiscas',
        code: '',
        url: '/consultaSiscas',
        description: 'SISCAS',
        parent: 'root',
        views: {
          content: {
            controller: 'consultaSiscasController',
            templateUrl: '/atencionsiniestrosagricola/app/siscas/components/consulta-siscas.html',
            controllerAs: 'vm'
          }
        },
        resolver: [
          {
            name: 'consultaSiscasController',
            moduleName: 'atencionsiniestrosagricola.app',
            files: [
              '/atencionsiniestrosagricola/app/siscas/controllers/consulta-siscas.js'
            ]
          }
        ]
      }
    ]; 

    return data;
  });