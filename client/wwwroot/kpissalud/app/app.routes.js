(function($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, "kpissaludRoutes", [],
  function() {
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
        name:'home',
        appCode: '',
        description: '',
        url:'/',
        parent: 'root',
        views: {
          content: {
            controller: 'HomeController',
            templateUrl: '/kpissalud/app/home/home.html'
          }
        },
        resolver: [
          {
            name: 'home',
            moduleName: 'kpissalud.app',
            files: [
              'HomeController'
            ]
          }
        ]
      },
      {
        name:'kpiSiniestro',
        appCode: '',
        description: 'Siniestros',
        url:'/kpiSiniestro',
        parent: 'root',
        views: {
          content: {
            controller: 'KpiSiniestroController',
            templateUrl: '/kpissalud/app/kpiSiniestro/kpiSiniestro.html'
          }
        },
        resolver: [
          {
            name: 'kpiSiniestro',
            moduleName: 'kpissalud.app',
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
        name:'kpiCgw',
        appCode: '',
        description: 'Cartas de Garantía',
        url:'/kpiCgw',
        parent: 'root',
        views: {
          content: {
            controller: 'KpiCgwController',
            templateUrl: '/kpissalud/app/kpiCgw/kpiCgw.html'
          }
        },
        resolver: [
          {
            name: 'kpiCgw',
            moduleName: 'kpissalud.app',
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
        name:'kpiConfiguracion',
        appCode: '',
        description: 'Configuración',
        url:'/kpiConfiguracion',
        parent: 'root',
        views: {
          content: {
            controller: 'KpiConfiguracionController',
            templateUrl: '/kpissalud/app/kpiConfiguracion/kpiConfiguracion.html'
          }
        },
        resolver: [
          {
            name: 'kpiConfiguracion',
            moduleName: 'kpissalud.app',
            files: [
              'KpiConfiguracionController',
              'formSetting'
            ]
          }
        ]
      }
    ]
    return data;
  });