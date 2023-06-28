/*TODO: REVIEW*/
/**
 * @doc-component directive
 * @name gaiafrontend.directive.mpGraphBar
 * @param {string} mpGraphBar receive a JSON containing an array with the data in the graph. Each subrray defines the X and Y coordinates of a point.
 * @description
 * This component draws a bar graph.
 * This component is DEPRECATED. Please use mpCharts instead.
 */
/*global angular */
angular.module('mpGraphBar', ['utils'])
    .directive('mpGraphBar', ['Loader',
        function(Loader) {
            var loadPlugin = Loader.load;

            return {
                replace: true,
                link: function(scope, elm, attrs) {
                    var dataGraph = angular.fromJson(attrs.mpGraphBar);

                    function drawGraph() {
                        angular.element.plot(elm, [{
                            data: dataGraph.data,
                            bars: {
                                show: true
                            }
                        }]);
                    }

                    loadPlugin('jquery.flot.js').then(drawGraph);
                }
            };
        }]);
