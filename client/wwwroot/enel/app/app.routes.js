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
          moduleName: "appEnel",
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
      name: 'enelHome',
      // code: '',
      appCode: '',
      description: '',
      url: '/home',
      parent: 'root',
      views: {
        content: {
          controller: 'enelHomeController',
          templateUrl: '/enel/app/home/controller/home.html'
        }
      },
      resolve: {
        // homeDocumentTypes: ['loaderEnelHomeController', 'enelHome', '$stateParams', function(loaderEnelHomeController, enelHome, $stateParams){
        //   return loaderEnelHomeController.getDocumentTypes();
        // }]
      },
      resolver: 
        [{
          name: 'enelHome',
          moduleName: 'appEnel',
          files: [
            'enelHomeController'
          ]
        }]
    },
    {
      name: 'enelBandeja',
      // code: '',
      appCode: '',
      description: '',
      url: '/bandeja',
      parent: 'root',
      views: {
        content: {
          controller: 'enelBandejaController',
          templateUrl: '/enel/app/bandeja/controller/bandeja.html'
        }
      },
      resolve: {
        bandejaTipoDocumentos: [ 'loaderEnelBandeja', 'enelBandeja' , function(loaderEnelBandeja, enelBandeja){
          return loaderEnelBandeja.initTipoDocumentos();
        }]
      },
      resolver: 
        [{
          name: 'enelBandeja',
          moduleName: 'appEnel',
          files: [
            'enelBandejaController'
          ]
        }]
    },
    {
      name: 'enelFormularioNuevo',
      // code: '',
      appCode: '',
      description: 'Nuevo certificado de hogar',
      url: '/formulario/nuevo',
      parent: 'root',
      views: {
        content: {
          controller: 'enelFormularioController',
          templateUrl: '/enel/app/formulario/controller/formulario.html'
        }
      },
      resolve: {
        formularioTipoProductos: ['loaderEnelFormulario', 'enelFormularioNuevo', function(loaderEnelFormulario, enelFormularioNuevo){
          return loaderEnelFormulario.initProductos();
        }],
        formularioTipoDocumentos: ['loaderEnelFormulario', 'enelFormularioNuevo' , function(loaderEnelFormulario, enelFormularioNuevo){
          return loaderEnelFormulario.initTipoDocumentos();
        }],
        formularioDepartamentos: ['loaderEnelFormulario', 'enelFormularioNuevo' , function(loaderEnelFormulario, enelFormularioNuevo){
          return loaderEnelFormulario.initDepartametos();
        }],
        formularioEmpresas: ['loaderEnelFormulario', 'enelFormularioNuevo', function(loaderEnelFormulario, enelFormularioNuevo){
          return loaderEnelFormulario.initEmpresas();
        }]
      },
      resolver: 
        [{
          name: 'enelFormularioNuevo',
          moduleName: 'appEnel',
          files: [
            'enelFormularioController'
          ]
        }]
    },
    {
      name: 'enelFormularioDetalle',
      // code: '',
      appCode: '',
      description: 'Certificado de hogar',
      url: '/formulario/detalle/:id_afiliado_producto',
      parent: 'root',
      views: {
        content: {
          controller: 'enelFormularioController',
          templateUrl: '/enel/app/formulario/controller/formulario.html'
        }
      },
      resolve: {
        formularioTipoProductos: ['loaderEnelFormulario', 'enelFormularioDetalle', function(loaderEnelFormulario, enelFormularioDetalle){
          return loaderEnelFormulario.initProductos();
        }],
        formularioTipoDocumentos: ['loaderEnelFormulario', 'enelFormularioDetalle' , function(loaderEnelFormulario, enelFormularioDetalle){
          return loaderEnelFormulario.initTipoDocumentos();
        }],
        formularioDepartamentos: ['loaderEnelFormulario', 'enelFormularioDetalle' , function(loaderEnelFormulario, enelFormularioDetalle){
          return loaderEnelFormulario.initDepartametos();
        }],
        formularioEmpresas: ['loaderEnelFormulario', 'enelFormularioDetalle', function(loaderEnelFormulario, enelFormularioDetalle){
          return loaderEnelFormulario.initEmpresas();
        }]
      },
      resolver: 
        [{
          name: 'enelFormularioDetalle',
          moduleName: 'appEnel',
          files: [
            'enelFormularioController'
          ]
        }]
    }
    
  ]

  return data;
});