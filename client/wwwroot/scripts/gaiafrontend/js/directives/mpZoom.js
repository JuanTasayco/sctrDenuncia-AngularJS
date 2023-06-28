/*global angular, Shadowbox */
/*DEPRECATED*/
/**
 * @doc-component directive
 * @name gaiafrontend.directive.mpZoom
 * @description
 * DEPRECATED
 * If you need this component ask for it through UX department
 */
angular.module('mpZoom', ['utils'])
    .directive('mpZoom', ['Loader',
        function(Loader) {
            var loadPlugin = Loader.load;

            return {
                scope: {
                    mpZoom: '@'
                },
                link: function() {
                    function zoom() {
                        Shadowbox.init();
                    }

                    loadPlugin('shadowbox.js').then(zoom);
                }
            };
        }]);
