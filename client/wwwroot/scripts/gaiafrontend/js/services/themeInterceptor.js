/*global angular */
angular.module('themeInterceptor', [])
    /**
     * @doc-component service
     * @name gaiafrontend.service.themeInterceptor
     * @description
     * This service is meant to be used as a `$http` interceptor.
     *
     * This interceptor manages GAIA themes. It works in conjuntion with `ThemeCtrl`.
     *
     * To use this interceptor in your application you only have to add this service to the `$httpProvider.interceptor` Array of your application as follows:
     *
     *  ```js
     *  var appModule = angular.module('myAppName', ['gaiafrontend']);
     *  appModule
     *     .config(['$httpProvider', function ($httpProvider) {
     *         $httpProvider.interceptors.push('ThemeInterceptor');
     *     ]);
     *  ```
     *
     * See `Theme` and `ThemeCtrl` for more info.
     *
     */
    .factory('ThemeInterceptor', ['Theme', function (Theme) {
        return {
            response: function(response) {
                var themeId = response.headers('X-User-theme');

                if (themeId && themeId !== Theme.get()) {
                    Theme.set(themeId);
                }

                return response;
            }
        };
    }]);
