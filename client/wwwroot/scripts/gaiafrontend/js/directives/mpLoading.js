/*TODO: REVIEW*/
/*global angular */
angular.module('mpLoading', [])
    /**
     * @doc-component service
     * @name gaiafrontend.service.LoadingSrv
     * @description
     * This service manages the loading view.
     */
    .factory('LoadingSrv', function() {
        var loading = {
            show: false,
            message: ''
        };

         /**
         * @doc-component method
         * @methodOf gaiafrontend.service.LoadingSrv
         * @name gaiafrontend.service.LoadingSrv#get
         * @return {object} loading object.
         * @description
         * This method gets the loading object.
         */
        function get() {
            return loading;
        }

         /**
         * @doc-component method
         * @methodOf gaiafrontend.service.LoadingSrv
         * @name gaiafrontend.service.LoadingSrv#set
         * @param {string} Message to display.
         * @description
         * Sets a message and makes the loading `div` visible.
         */
        function set(message) {
            loading.show = true;
            loading.message = message;
        }

         /**
         * @doc-component method
         * @methodOf gaiafrontend.service.LoadingSrv
         * @name gaiafrontend.service.LoadingSrv#hide
         * @description
         * Hides the loading `div`..
         */
        function hide() {
            loading.show = false;
        }

        return {
            get: get,
            set: set,
            hide: hide
        };
    })
    /**
     * @doc-component controller
     * @name gaiafrontend.controller.LoadingCtrl
     * @description
     * The loading controller depends on LoadingSrv and it is used by mpLoading to manage the loading layer.
     */
    .controller('LoadingCtrl', ['$scope', 'LoadingSrv', function($scope, LoadingSrv) {
        $scope.loading = LoadingSrv.get();
    }])
    /**
     * @doc-component directive
     * @name gaiafrontend.directive.mpLoading
     * @param {string} mpLoading Image source path to display while loading.
     * @param {string} mp-message-waiting-alt Alternative text for the image displayed.
     * @description
     * Standard loading layer. Its visibility depends on LoadingSrv so take a look at the service.
     * @example
       <doc:example module="mpLoading">
        <doc:source>
        div(mp-loading="gaiafrontend/img/spinner.gif", mp-loading-alt="waiting...")
        </doc:source>
       </doc:example>
     */
    .directive('mpLoading', function() {
        return {
            replace: true,
            transclude: true,
            controller: 'LoadingCtrl',
            scope: {
                mpLoading: '@',
                mpLoadingAlt: '@'
            },
            templateUrl: 'gaiafrontend/html/loading.html'
        };
    });
