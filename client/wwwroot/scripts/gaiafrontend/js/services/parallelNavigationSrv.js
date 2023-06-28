/*global angular */
angular.module('parallelNavigationSrv', [])
    /**
     * @doc-component service
     * @name gaiafrontend.service.ParallelNavigationSrv
     * @description
     * This service lets mantaining a parallel navigation among processes, keeping the data in the aplication's flow.
     *
     * To use this service in your application you only have to add it into the Array of your application as follows:
     *
     *  ```js
     *  (appModule.lazy || appModule)
     *     .controller('myControllerName', ['ParallelNavigationSrv', function (parallelNavigationSrv) {
     *          parallelNavigationSrv('state', data);
     *     }]);
     *  ```
     */
    .factory('ParallelNavigationSrv', ['$q', '$state', '$window', function($q, $state, $window) {
        return function(state, data) {
            var deferred = $q.defer(),
                body,
                bodyContent,
                iframe;

            function removeParallelNavigation() {
                iframe.remove();
                iframe = null;
                body.removeAttr('style');
                body = null;
                bodyContent.show();
                bodyContent = null;
            }

            (function createParallelNavigation() {
                body = angular.element('body').attr('style', 'padding: 0; margin: 0; overflow: hidden;');
                bodyContent = angular.element('body').children().hide();
                iframe = angular.element('<iframe />')
                    // IE8 FIX
                    //FF FIX use $window.innerXXX
                    .attr('frameBorder', '0')
                    .attr('style', 'border: 0')
                    .attr('width', $window.innerWidth)
                    .attr('height', $window.innerHeight).appendTo(body);
                // IE8 FIX
                iframe[0].contentWindow.document.location = window.document.location.href.split(window.document.location.hash)[0] + ($state.href(state) || state);

                // IE8 FIX
                iframe[0].onload = function() {
                    if (angular.isDefined(data)) {
                        iframe[0].contentWindow.sessionStorage.setItem(state, angular.toJson(data));
                    }

                    iframe[0].contentWindow.resolve = function(data) {
                        deferred.resolve(data);
                        removeParallelNavigation();
                    }

                    iframe[0].contentWindow.reject = function(reason) {
                        deferred.reject(reason);
                        removeParallelNavigation();
                    }
                }

                window.onpopstate = function() {
                    removeParallelNavigation();
                    window.onpopstate = null;
                };

                angular.element($window).bind('resize', function(){
                    var myIframe = angular.element('iframe')
                        .attr('width', $window.innerWidth)
                        .attr('height', $window.innerHeight);
                });
            }());

            return deferred.promise;
        }
    }]);
