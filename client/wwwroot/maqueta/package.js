(function(factory)
{
    define(factory);
})(function()
{
    return  {
             lib: {
                  "maqueta_routes": {
                     name: 'maqueta_routes',
                     path : '/maqueta/app/app.routes'
                  },
                  'appMaqueta':{
                     name: 'appMaqueta',
                     path : '/maqueta/app/app'
                  },
                  //pages
                  'maquetaController' : {
                     name: 'maquetaController',
                     path : '/maqueta/app/maqueta/controller/maqueta'
                  }
            },
            shim: {
                'appMaqueta': { deps: ['angular_ui_route', 'uIBootstrap', 'oim_ocLazyLoad', 'oim_layout', 'lodash', 'proxyLogin', 'oim_security', 'wrap_gaia'] }
                // 'proxyNsctr': { deps: ['wrap_gaia'] }
            },
            packages :{

            }
    }

});
