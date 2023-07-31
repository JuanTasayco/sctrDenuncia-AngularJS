define(['angular',
    'app_routes',
    'angular_route',
    'angular_ocLazyLoad',
    'angular_ui_route',
    'wrap_gaia',
    'oim_ocLazyLoad',
    'oim_theme_service',
    'mDirective',
    'helper',
    'oim_security',
    'loginTemplates',
    'storageManager',
    'angular_cookies'
], function(require, app_routes, angular_route) {

    var baseUrl = "";
    // create new module appLogin
    var appLogin = angular.module('appLogin', ['ngRoute',
        'oc.lazyLoad',
        'ui.router',
        'ui.bootstrap',
        'oim.oc.lazyload',
        'oim.theme.service',
        'mapfre.controls',
        'oim.security.authentication',
        'oim.security.authorization',
        'oim.wrap.gaia.httpSrv',
        'oim.wrap.gaia.cookieSrv',
        'oim.login.templates',
        'storage.manager',
        'ngSanitize',
        'ngCookies'
    ]);



    appLogin.config(['$stateProvider', '$ocLazyLoadProvider', '$urlRouterProvider', 'objectSystemConfiguration', '$locationProvider', function($stateProvider, $ocLazyLoadProvider, $urlRouterProvider, objectSystemConfiguration, $locationProvider) {
        objectSystemConfiguration.allowAuthorization = false;
        //Other version $ocLazyLoad
        $ocLazyLoadProvider.config({
            debug: false,
            loadedModules: ['appLogin'],

            //NOTES GC - IMPORTANT: resolve depends with require js
            // asyncLoader: require
        });

        //appLogin.$register = $provide;
        for (var i = 0; i < app_routes.length; i++) {
            var value = app_routes[i];
            if (angular.isArray(value.urls)) {
                angular.forEach(value.urls, function(u, r) {
                    var s = helper.clone(value);
                    delete s.urls;
                    if (typeof u === 'string') {
                        s.url = u;
                        $stateProvider.state(value.name, s);
                    } else {
                        s.url = u.url;
                        s.params = u.params
                        $stateProvider.state(u.name, s);
                    }

                });
            } else {
                $stateProvider.state(value.name, value);
            }
            //  $locationProvider.html5Mode(true);
        }


        $urlRouterProvider.otherwise("/");

    }]).config(['$httpProvider', function($httpProvider) {
        // Set up $http interceptors

        //	$httpProvider.interceptors.push('ErrorInterceptor','sessionInterceptor');
    }]).run(['$rootScope', 'oimProgress', '$state', 'mapfreAuthetication', '$window', '$location',
    function($rootScope, oimProgress, $stateProvider, mapfreAuthetication, $window, $location) {

        var detectRecurrent = mapfreAuthetication.isRecurrent() && !$window.localStorage['lsUserTypes'];

        function _isNewPassword(currentState){
          return currentState.name === 'newPassword';
        }

        $rootScope.$on('$stateChangeStart', function(evt, to, params) {
            if (detectRecurrent && !_isNewPassword(to)) {
              evt.preventDefault();
              detectRecurrent = !detectRecurrent;
              var dataFromMyDream = mapfreAuthetication.isMyDreamAppOrigin() && mapfreAuthetication.myDreamAppData();

              $stateProvider.go("loginByType", { data: dataFromMyDream });
            }
            oimProgress.start();
        });

        $rootScope.$on('$stateChangeSuccess', function(value, cstate) {
            angular.getTestability(angular.element(document.body)).whenStable(function() {
                window.setTimeout(function() {
                    document.body.style.display = "block"
                }, 100)
            });

            oimProgress.end();

            var stateLogin = 'login',
                stateUserTypes = 'authoButtons';
            $rootScope.welcomeUserTypes = cstate.name == stateUserTypes;
            $rootScope.showCommonControl = cstate.name !== stateLogin;

        });
    }]);

    appLogin.controller('btnHomeController',
      ['$scope', '$window', '$state', '$rootScope', 'mapfreAuthetication', 'accessSupplier',
      function($scope, $window, $state, $rootScope, mapfreAuthetication, accessSupplier) {

        $scope.fnGoLogin = function(){
          accessSupplier.clean();
          mapfreAuthetication.cleanProfile();
          $state.go('login');
        };

    }]);

});
