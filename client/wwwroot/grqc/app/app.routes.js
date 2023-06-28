//Jordan
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
          moduleName: 'appGrqc',
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
      name: 'homeGrqc',
      code: '',
      url: '/',
      description: 'Gestion de Requerimientos',
      parent: 'root',
      views: {
        content: {
          controller: 'GrqcHomeController',
          templateUrl: '/grqc/app/home/controller/grqc-home.html'
        }
      },
      resolver: [
        {
          name: 'homeGrqc',
          moduleName: 'appGrqc',
          files: [
            '/grqc/app/home/controller/grqc-home.controller.js'
          ]
        }
      ]
    },
    /*INICIO - BANDEJA DE REQUERIMIENTOS*/
    {
      name: 'bandejaRequerimientos',
      code: '',
      url: '/bandejaRequerimientos',
      description: 'Bandeja de Requerimientos',
      parent: 'root',
      views: {
        content: {
          controller: 'GrqcBandejaRequerimientosController',
          templateUrl: '/grqc/app/bandejaRequerimientos/grqc-bandejaRequerimientos.html'
        }
      },
      resolver: [
        {
          name: 'bandejaRequerimientos',
          moduleName: 'appGrqc',
          files: [
            '/grqc/app/bandejaRequerimientos/grqc-bandejaRequerimientos.controller.js'
          ]
        }
      ]      
    },
    /*FIN - BANDEJA DE REQUERIMIENTOS*/  

    /*INICIO - BANDEJA DE GESTIÓN*/
    {
      name: 'bandejaGestion',
      code: '',
      url: '/bandejaGestion',
      description: 'Bandeja de Gestion',
      parent: 'root',
      views: {
        content: {
          controller: 'GrqcBandejaGestionController',
          templateUrl: '/grqc/app/bandejaGestion/grqc-bandejaGestion.html'
        }
      },
      resolver: [
        {
          name: 'bandejaGestion',
          moduleName: 'appGrqc',
          files: [
            '/grqc/app/bandejaGestion/grqc-bandejaGestion.controller.js'
          ]
        }
      ]      
    }
    /*FIN - BANDEJA DE GESTIÓN*/      
  ];

  return data;
});
