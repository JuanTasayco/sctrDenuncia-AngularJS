define(['constants'], function (constants) {
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
        authorizedResource : ['accessSupplier', function(accessSupplier){
           
            return accessSupplier.getAllObject();
        }]
      },
      resolver: [
        // {
        //   name: "automovilHome",
        //   moduleName: "appAutos",
        //   files: ['/polizas/app/autos/autosHome/controller/automovil-home.js'],
        //   resolveTemplate: true
        // },
        {
          name: "layout",
          // moduleName: "oim.layout",
          moduleName: "appCallerDashboard",
          files: ['topController',
            'headerController',
            'leftBarController',
            'bodyMiddelController',
            'bodyLeftController',
            'rightBarController',
            'footerController',
            'bottomController'],
        },
      ]
    },
    {
      name: 'callerDashboardHome',
      // code: '',
      appCode: '',
      description: '',
      url: '/home',
      parent: 'root',
      views: {
        content: {
          controller: 'callerDashboardHomeController',
          templateUrl: '/callerDashboard/app/home/controller/home.html'
        }
      },
      resolve: {
        // homeDocumentTypes: ['loadercallerDashboardHomeController', 'callerDashboardHome', '$stateParams', function(loadercallerDashboardHomeController, callerDashboardHome, $stateParams){
        //   return loadercallerDashboardHomeController.getDocumentTypes();
        // }]
      },
      resolver: 
        [{
          name: 'callerDashboardHome',
          moduleName: 'appCallerDashboard',
          files: [
            'callerDashboardHomeController'
          ]
        }]
    },
    {
      name: 'callerDashboardLlamar',
      // code: '',
      appCode: '',
      description: '',
      url: '/solicitudes/llamar',
      parent: 'root',
      views: {
        content: {
          controller: 'callerDashboardLlamarController',
          templateUrl: '/callerDashboard/app/llamar/controller/llamar.html'
        }
      },
      resolve: {
        // homeDocumentTypes: ['loadercallerDashboardHomeController', 'callerDashboardHome', '$stateParams', function(loadercallerDashboardHomeController, callerDashboardHome, $stateParams){
        //   return loadercallerDashboardHomeController.getDocumentTypes();
        // }]
      },
      resolver: [
        {
          name: 'callerDashboardLlamar',
          moduleName: 'appCallerDashboard',
          files: [
            '/callerDashboard/app/llamar/controller/llamar.js'
          ]
        }
      ]
    },
    {
      name: 'callerDashboardAsignar',
      // code: '',
      appCode: '',
      description: '',
      url: '/solicitudes/asignar',
      parent: 'root',
      views: {
        content: {
          controller: 'callerDashboardAsignarController',
          templateUrl: '/callerDashboard/app/asignar/controller/asignar.html'
        }
      },
      resolve: {
        // homeDocumentTypes: ['loadercallerDashboardHomeController', 'callerDashboardHome', '$stateParams', function(loadercallerDashboardHomeController, callerDashboardHome, $stateParams){
        //   return loadercallerDashboardHomeController.getDocumentTypes();
        // }]
      },
      resolver: [
        {
          name: 'callerDashboardAsigsnar',
          moduleName: 'appCallerDashboard',
          files: [
            '/callerDashboard/app/asignar/controller/asignar.js'
          ]
        }
      ]
    },
    {
      name: 'callerDashboardAsignadas',
      // code: '',
      appCode: '',
      description: '',
      url: '/solicitudes/asignadas',
      parent: 'root',
      views: {
        content: {
          controller: 'callerDashboardAsignadasController',
          templateUrl: '/callerDashboard/app/asignadas/controller/asignadas.html'
        }
      },
      resolve: {
        // homeDocumentTypes: ['loadercallerDashboardHomeController', 'callerDashboardHome', '$stateParams', function(loadercallerDashboardHomeController, callerDashboardHome, $stateParams){
        //   return loadercallerDashboardHomeController.getDocumentTypes();
        // }]
      },
      resolver: [
        {
          name: 'callerDashboardAsigsnadas',
          moduleName: 'appCallerDashboard',
          files: [
            '/callerDashboard/app/asignadas/controller/asignadas.js'
          ]
        }
      ]
    },

    
  ]

  return data;
});