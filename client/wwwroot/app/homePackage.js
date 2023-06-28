(function(factory) {
    define(factory);
})(function() {
    return {
        lib: {
            "bodyLeftController": {
                name: 'bodyLeftController',
                path: "/app/index/controller/bodyLeftController"
            },
            "bottomController": {
                name: 'bottomController',
                path: "/app/index/controller/bottomController"
            },
            "bodyMiddelController": {
                name: 'bodyMiddelController',
                path: "/app/index/controller/bodyMiddelController"
            },
            "footerController": {
                name: 'footerController',
                path: "/app/index/controller/footerController"
            },
            "headerController": {
                name: 'headerController',
                path: "/app/index/controller/headerController"
            },
            "leftBarController": {
                name: 'leftBarController',
                path: "/app/index/controller/leftBarController"
            },
            "rightBarController": {
                name: 'rightBarController',
                path: "/app/index/controller/rightBarController"
            },
            "topController": {
                name: 'topController',
                path: "/app/index/controller/topController"
            },
            'routesHome': {
                name: 'routesHome',
                path: '/app/app.routes'
            },
            'authorizationProxyModule': {
                name: "authorizationProxyModule",
                path: '/app/services/authorizationProxyModule'
            },
            'app': {
                name: 'app',
                path: 'app'
            },
            'oim_layout': {
                name: 'oim_layout',
                path: '/app/index/oim.layout'
            },
            'homeTemplates': {
                name: 'homeTemplates',
                path: '/app/homeTemplates'
            },


        },
        shim: {
            app: { deps: ['routesHome', 'angular_ui_route', 'oim_ocLazyLoad', 'oim_layout'] },
            authorizationProxyModule: { deps: ['angular'] },
            homeTemplates: { deps: ['angular'] },
            oim_layout: { deps: ['authorizationProxyModule', 'jinqJs', 'linqjs', 'oim_security', 'homeTemplates'] }
        },
        packages: {

        }

    }

});