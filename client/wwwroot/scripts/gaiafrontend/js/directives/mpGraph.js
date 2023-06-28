/*TODO: REVIEW*/
/**
 * @doc-component directive
 * @name gaiafrontend.directive.mpGraph
 * @param {string} mpGraph receive a JSON containing an array with the data in the graph. Each subrray defines the X and Y coordinates of a point.
 * @description
 * This component draws a basic graph.
 * This component is DEPRECATED. Please use mpCharts instead.
 */
/*global angular */
angular.module('mpGraph', ['utils'])
    .directive('mpGraph', ['Loader',
        function(Loader) {
            var loadPlugin = Loader.load;

            return {
                replace: true,
                link: function(scope, elm, attrs) {
                    var dataGraph = angular.fromJson(attrs.mpGraph);

                    function drawGraph() {
                        angular.element.plot(elm, [{
                            data: dataGraph.data,
                            lines: {
                                show: true,
                                fill: true
                            }
                        }]);
                    }

                    loadPlugin('jquery.flot.js').then(drawGraph);
                }
            };
        }]);
