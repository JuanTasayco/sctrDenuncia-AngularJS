(function(factory) {
  define(factory);
})(function() {
  return {
    lib: {
      "callerDashboard_routes": {
        name: 'callerDashboard_routes',
        path: '/callerDashboard/app/app.routes'
      },
      'appCallerDashboard': {
        name: 'appCallerDashboard',
        path: '/callerDashboard/app/app'
      },
      //proxy
      'proxyCallerDashboard': {
        name: 'proxyCallerDashboard',
        path: '/callerDashboard/app/proxy/serviceCallerDashboard'
      },
      // 'proxyEnelFactory': {
      //    name: 'proxyEnelFactory',
      //    path : '/enel/app/proxyFactory/enelFactory'
      // },
      //pages
      'callerDashboardHomeController': {
        name: 'callerDashboardHomeController',
        path: '/callerDashboard/app/home/controller/home'
      },
      //components

    },
    shim: {
      'appCallerDashboard': { deps: ['angular_ui_route', 'uIBootstrap', 'oim_ocLazyLoad', 'oim_layout', 'lodash', 'proxyLogin', 'oim_security'] },
      // 'appEnel': { deps: ['angular_ui_route', 'uIBootstrap', 'oim_ocLazyLoad', 'oim_layout', 'lodash', 'proxyLogin', 'oim_security'] },
      'proxyCallerDashboard': { deps: ['wrap_gaia'] }
    },
    packages: {

    }
  }

});