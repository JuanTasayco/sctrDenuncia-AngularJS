(function(factory)
{
    define(factory);
})(function()
{
    return  {
             lib: {
                  "enel_routes": {
                     name: 'enel_routes',
                     path : '/enel/app/app.routes'
                  },
                  'appEnel':{
                     name: 'appEnel',
                     path : '/enel/app/app'
                  },
                  //proxy
                  'proxyEnel': {
                     name: 'proxyEnel',
                     path : '/enel/app/proxy/serviceEnel'
                  },
                  // 'proxyEnelFactory': {
                  //    name: 'proxyEnelFactory',
                  //    path : '/enel/app/proxyFactory/enelFactory'
                  // },
                  //pages
                  'enelHomeController' : {
                     name: 'enelHomeController',
                     path : '/enel/app/home/controller/home'
                  },
                  'enelBandejaController' : {
                     name: 'enelBandejaController',
                     path : '/enel/app/bandeja/controller/bandeja'
                  },
                  'enelFormularioController' : {
                     name: 'enelFormularioController',
                     path : '/enel/app/formulario/controller/formulario'
                  },
                  //components

            },
            shim: {
                'appEnel': { deps: ['angular_ui_route', 'uIBootstrap', 'oim_ocLazyLoad', 'oim_layout', 'lodash', 'proxyEnel', 'proxyLogin', 'oim_security'] },
                // 'appEnel': { deps: ['angular_ui_route', 'uIBootstrap', 'oim_ocLazyLoad', 'oim_layout', 'lodash', 'proxyLogin', 'oim_security'] },
                'proxyEnel': { deps: ['wrap_gaia'] }
            },
            packages :{

            }
    }

});
