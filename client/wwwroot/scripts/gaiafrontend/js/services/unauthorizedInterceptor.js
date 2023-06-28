/*global angular */
angular.module('unauthorizedInterceptor', [])
    .constant('UnauthorizedConfig', {
        status: 401,
        redirectionUrl: '#/login'
    })
    /**
     * @doc-component service
     * @name gaiafrontend.service.unauthorizedInterceptor
     * @description
     * This service is meant to be used as a `$http` interceptor.
     *
     * This interceptor redirects our GAIA application to a defined URL when the response status code is 401.
     *
     * To use this interceptor in your application you only have to add this service to the `$httpProvider.interceptor` Array of your application as follows:
     *
     *  ```js
     *  var appModule = angular.module('myAppName', ['gaiafrontend']);
     *  appModule
     *     .config(['$httpProvider', function ($httpProvider) {
     *         $httpProvider.interceptors.push('UnauthorizedInterceptor');
     *     ]);
     *  ```
     *
     * We can set the `redirectionUrl` in the config method of our main module like follows:
     *
     *  ```js
     *  var appModule = angular.module('myAppName', ['gaiafrontend']);
     *  appModule
     *     .config(['$httpProvider', 'UnauthorizedConfig', function ($httpProvider, UnauthorizedConfig) {
     *         UnauthorizedConfig.redirectionUrl = '/login.html';
     *         $httpProvider.interceptors.push('UnauthorizedInterceptor');
     *     ]);
     *  ```
     */
    .factory('UnauthorizedInterceptor', ['$q', '$window', 'UnauthorizedConfig', function ($q, $window, config) {
        var cache = {};

        return {
            getDestinationUrl: function () {
                return cache.destinationUrl;
            },
            responseError: function(rejection) {
                if (+rejection.status === config.UNAUTHORIZED_CODE) {
                    cache.destinationUrl = $window.location.hash;
                    $window.location = config.redirectionUrl;
                }

                return $q.reject(rejection);
            }
        };
    }]);
