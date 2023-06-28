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
          moduleName: "appNsctr",
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
      name: 'maqueta',
      // code: '',
      appCode: '',
      description: '',
      url: '/maqueta',
      parent: 'root',
      views: {
        content: {
          controller: 'maquetaController',
          templateUrl: '/maqueta/app/maqueta/controller/maqueta.html'
        }
      },
      // resolve: {
      //   searchClientDocumentTypes: ['loaderNsctrSearchClientController', 'nsctrSearchClient', '$stateParams', function(loaderNsctrSearchClientController, nsctrSearchClient, $stateParams){
      //     return loaderNsctrSearchClientController.getDocumentTypes();
      //   }]
      // },
      resolver: 
        [{
          name: 'maqueta',
          moduleName: 'appMaqueta',
          files: [
            'maquetaController'
          ]
        }]
    }
  ]

  return data;
});