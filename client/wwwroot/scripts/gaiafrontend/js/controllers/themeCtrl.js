/*TODO: REVIEW*/
/*global angular */
angular.module('themeCtrl', [])
    /**
     * @doc-component controller
     * @name gaiafrontend.controller.themeCtrl
     * @description
     * The theme for the application is handled by this controller. It can be used as follows:
     *
     *  ```js
     *  <link rel="stylesheet" ng-controller="ThemeCtrl" ng-href="gaiafrontend/css/{{theme}}.css"/>
     *  ```
     *
     * See `Theme` and `ThemeInterceptor` for more info.
     *
     */
    .controller('ThemeCtrl', ['$scope', 'Theme',
        function($scope, Theme) {
            $scope.theme = Theme.get();
        }]);
