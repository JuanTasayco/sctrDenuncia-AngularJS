(function(factory)
{
    define(factory);
})(function()
{
    return  {
             lib: {
                  "restos_routes": {
                     name: 'restos_routes',
                     path : '/restos/app/app.routes'
                  },
                  'appRestos':{
                     name: 'appRestos',
                     path : '/restos/app/app'
                  },
                  'restosFactoryPath': {
                     name: 'restosFactoryPath',
                     path : '/restos/app/mainControls/factory/factory'
                  },
                  'restosServicePath': {
                     name: 'restosServicePath',
                     path : '/restos/app/mainControls/service/service'
                  },
                  //pages
                  'requestTrayController' : {
                     name: 'requestTrayController',
                     path : '/restos/app/requestTray/controller/requestTray'
                  },
                  'newRequestController' : {
                     name: 'newRequestController',
                     path : '/restos/app/newRequest/controller/newRequest'
                  },
                  'solicitudRegistradaController' : {
                     name: 'solicitudRegistradaController',
                     path : '/restos/app/requests/controller/solicitudRegistradaController'
                  },
                  'requestDetails' : {
                     name: 'requestDetailsController',
                     path : '/restos/app/requestDetails/controller/requestDetails'
                  },
                  'solicitudVendidoController' : {
                     name: 'solicitudVendidoController',
                     path : '/restos/app/requests/controller/solicitudVendidoController'
                  }
            },
            shim: {
                'appRestos': { deps: ['angular_ui_route', 'uIBootstrap', 'oim_ocLazyLoad', 'oim_layout', 'lodash', 'proxyLogin', 'oim_security', 'wrap_gaia'] }
            },
            packages :{

            }
    }

});
