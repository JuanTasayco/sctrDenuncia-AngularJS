/*global angular, _ */
/**
    * @doc-component directive
    * @name gaiafrontend.directive.mpCharts
    * @description
    * This component has been migrated to "GAIA Site"
    * There you will find its documentation and several examples.
    * "GAIA Site" is an application created by the Architecture Area to learn and play with GAIA. Is available in RAS. Direct links are available below in this page.
    * @example
    <doc:example>
         <doc:source>
         label GAIA site direct links are:
         a(href='https://wportalinterno.es.mapfre.net/com.ibm.ram.repository.web/faces/_rlvid.jsp?_rap=!assetDetails&_rvip=/home.jsp&guid=13A33828-B921-8DC5-DEDA-8B8D7C0EBC81') Intranet /
         a(href='https://wportalinterno.mapfre.com/com.ibm.ram.repository.web/faces/_rlvid.jsp?_rap=!assetDetails&_rvip=/home.jsp&guid=13A33828-B921-8DC5-DEDA-8B8D7C0EBC81') Internet
         </doc:source>
    </doc:example>
*/
(function() {
    'use strict';
    function mpCharts(Loader, $parse, $q, $window, Utils) {
        return {
            scope: {
                mpChartsData: '=',
                mpChartsOptions: '='
            },
            link: function(scope, elem, attrs) {
                var plot,
                    opts = scope.mpChartsOptions,
                    loadPlugin = Loader.load('jquery.jqplot.min.js');

                /* -- Methods for chart resizing --*/
                angular.element($window).bind('resize', function() {
                    scope.width = $window.innerWidth;
                    opts.width = elem.parent().width() * 0.96;
                    scope.$digest();
                });

                if (Utils.platform.isTactile()) {
                    angular.element(window).on("orientationchange", function(event) {
                        resetLegend();
                        renderChart();
                        event.preventDefault();
                    });
                }

                function resetLegend() {
                    if (window.matchMedia('(max-width: 640px)').matches && !angular.isUndefined(opts.legend)) {
                        if (window.matchMedia("(orientation: portrait)").matches)
                            opts.legend.location = 's';
                            opts.legend.fontSize = '.4em';
                      /*  } else if (window.matchMedia("(orientation: landscape)").matches) {
                            opts.legend.location = 'e';
                            opts.legend.fontSize = '1em';
                        }*/
                    }
                }


                scope.$watch('width', function(newValue, oldValue) {
                    if (!angular.isUndefined(oldValue) && newValue !== oldValue && !angular.isUndefined(plot)) {
                        resetLegend();
                        plot.replot({
                            resetAxes: true,
                            rendererOptions: {
                                barPadding: 4,
                                barMargin: 5
                            }
                        });
                    }
                });
                /*--*/

                /*-- Render chart --*/
                function renderChart() {
                    var dataSerial = scope.mpChartsData;

                    if (angular.element.jqplot) {
                        elem.html('');

                        if (!angular.isArray(scope.mpChartsData)) {
                            throw 'No data to display';
                        }
                        if (!angular.isUndefined(scope.mpChartsOptions)) {

                            if (!angular.isUndefined(opts.seriesDefaults) && typeof opts.seriesDefaults.renderer === 'string')
                                opts.seriesDefaults.renderer = $parse(opts.seriesDefaults.renderer)(window.jQuery.jqplot);
                            if (!angular.isUndefined(opts.axes) && typeof opts.axes.xaxis.renderer === 'string')
                                opts.axes.xaxis.renderer = $parse(opts.axes.xaxis.renderer)(window.jQuery.jqplot);

                            if (!angular.isObject(opts)) {
                                throw 'Invalid mpCharts options attribute';
                            }
                            plot = angular.element.jqplot(attrs.id, [dataSerial], opts);

                        }
                    }
                }


                /*angular.element(elem).offsetParent()
                    .on("click", function(event) {
                        plot.destroy();
                        renderChart();
                        event.preventDefault();
                    })
                    .on('$destroy', function() {
                        angular.element(elem).offsetParent().off('click', renderChart);
                    });*/


                function setLibs(lib) {
                    return lib.substring(0, 1).toLowerCase() + lib.substring(1);
                }

                function getValues(obj, key) {
                    var objects = [],
                        libs = [];
                    for (var i in obj) {
                        if (!obj.hasOwnProperty(i)) continue;
                        if (typeof obj[i] === 'object') {
                            objects = objects.concat(getValues(obj[i], key));
                        } else if (i === key) {
                            objects.push(obj[i]);
                        }
                    }
                    return objects;
                }

                function getLibs() {
                    var promises = [],
                        promise;
                    _.forEach(getValues(scope.mpChartsOptions, 'renderer'), function(libs) {
                        promise = Loader.load('jqplot.' + setLibs(libs) + '.min.js');
                        promises.push(promise);
                    });
                    return $q.all(promises);
                }

                function loadCursor() {
                    return Loader.load('jqplot.cursor.min.js')
                }

                function loadHighlighter() {
                    return Loader.load('jqplot.highlighter.min.js')
                }

                loadPlugin
                    .then(loadCursor)
                    .then(loadHighlighter)
                    .then(getLibs)
                    .then(resetLegend)
                    .then(renderChart);
            }
        }
    }

    (angular.module('mpCharts', []))
    .directive('mpCharts', ['Loader', '$parse', '$q', '$window', 'Utils', mpCharts])
}());
