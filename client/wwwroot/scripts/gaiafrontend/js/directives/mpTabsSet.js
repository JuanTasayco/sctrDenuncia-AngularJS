/*global angular, _ */
/**
    * @doc-component directive
    * @name gaiafrontend.directive.mpTabsSet
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
    function mpTabsSet($window) {
        return {
            restrict: 'A',
            scope: {
                closeOthers: '='
            },
            link: function(scope, element, attrs) {
                var activetab = angular.element('ul.tabSet').find('li.active'),
                    tabs = angular.element('.tab-title'),
                    width = $window.innerWidth,
                    lastSelected;

                function getWindowSize() {
                    angular.element(window).resize(function(event) {
                        if (width > 800 && !scope.closeOthers && lastSelected) {
                            _.forEach(tabs, function(tabs) {
                                angular.element(tabs).removeClass('active');
                            });
                            lastSelected.addClass('active');
                        }
                    });
                }

                scope.$watch(width, function(newValue, oldValue) {
                    if (newValue !== oldValue)
                        getWindowSize();
                });

                angular.element(activetab).next().addClass('setDisplay');

                // The clicking action
                angular.element('.tab-title').on('click', function() {
                    if (!angular.element(this).hasClass('disabled')) {
                        if (!window.matchMedia('(max-width: 800px)').matches) {
                            angular.element('.tab_content').hide();
                            angular.element(this).next().show().prev().addClass('active').siblings().removeClass('active');
                        } else {
                            if (scope.closeOthers) {
                                _.forEach(tabs, function(tabs) {
                                    angular.element(tabs).removeClass('active');
                                })
                            }
                            angular.element(this).toggleClass('active');
                        }
                    }
                    lastSelected = angular.element(this);
                });

                getWindowSize();
            }
        }
    }

    (angular.module('mpTabsSet', []))
    .directive('mpTabsSet', ['$window', mpTabsSet])
}());
