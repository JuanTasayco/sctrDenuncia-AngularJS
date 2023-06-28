/*TODO: REVIEW*/
/**
 * @doc-component directive
 * @name gaiafrontend.directive.mpGraphPie
 * @param {string} mpGraphPie receive a JSON containing an array with the data in the graph.Each JSON array within the portion of the pie. The JSON propiedadlabel each defines the label to describe a portion. The JSON data property defines the portion size with a number from 1 to 100.
 * @description
 * This component draws a pie graph.
 * This component is DEPRECATED. Please use mpCharts instead.
 */
/*global angular */
angular.module('mpGraphPie', ['utils'])
    .directive('mpGraphPie', ['Loader',
        function(Loader) {
            var loadPlugin = Loader.load;

            return {
                replace: true,
                link: function(scope, elm, attrs) {
                    var dataGraph = angular.fromJson(attrs.mpGraphPie);

                    /* Draws the graph using the plugin */

                    function drawGraph() {
                        angular.element.plot(elm, dataGraph.data, {
                            series: {
                                pie: {
                                    show: true
                                }
                            }
                        });
                    }

                    loadPlugin('jquery.flot.js').then(function() {
                        loadPlugin('jquery.flot.pie.js').then(drawGraph);
                    });
                }
            };
        }]);
